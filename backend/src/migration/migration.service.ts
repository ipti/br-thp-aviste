import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { student_data } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { PostMigrationDto } from './dto/post-migration.dto';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);
  private readonly token: string;
  private readonly baseUrl = 'https://br-thp-meuben.azurewebsites.net/migration-bff';
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly inFlightByKey = new Map<string, Promise<unknown>>();

  constructor(private readonly prisma: PrismaService, configService: ConfigService) {
    this.token = configService.getOrThrow<string>('MIGRATION_TOKEN');
    this.timeoutMs = Number(configService.get<string>('MIGRATION_TIMEOUT_MS') ?? 10000);
    this.maxRetries = Number(configService.get<string>('MIGRATION_MAX_RETRIES') ?? 2);
  }

  async getProjects(): Promise<unknown> {
    try {
      const response = await this.requestWithRetry(() =>
        axios.get(`${this.baseUrl}/aviste?token=${this.token}`, { timeout: this.timeoutMs }),
      );
      return this.normalizeProjectsResponse(response.data);
    } catch (error) {
      this.logExternalError('getProjects', error);
      this.throwMappedExternalError(error, 'Falha ao buscar projetos no MeuBen');
    }
  }

  async sendStudents(dto: PostMigrationDto): Promise<unknown> {
    const classroomId = dto.id ?? dto.classroom_fk;
    if (!classroomId) {
      throw new BadRequestException('id da turma e obrigatorio');
    }

    const currentYearPlusOne = new Date().getFullYear() + 1;
    if (dto.year > currentYearPlusOne) {
      throw new BadRequestException(`year deve ser <= ${currentYearPlusOne}`);
    }

    const records = await this.prisma.student_data.findMany({
      where: { classroom_fk: classroomId },
    });

    if (records.length === 0) {
      this.logger.warn(`Migracao bloqueada: turma ${classroomId} sem matriculas`);
      throw new BadRequestException('Nao ha matriculas na turma selecionada');
    }

    const outOfClassroom = records.filter((record) => record.classroom_fk !== classroomId);
    if (outOfClassroom.length > 0) {
      throw new InternalServerErrorException('Foram encontrados estudantes fora da turma informada');
    }

    const studentErrors: Array<{ student_id: number; name: string; missing_or_invalid_fields: string[] }> =
      [];

    const registration = records.map((record) => {
      const mapped = this.mapStudent(record);
      if ('errors' in mapped) {
        studentErrors.push({
          student_id: record.id,
          name: record.name,
          missing_or_invalid_fields: mapped.errors,
        });
        return null;
      }
      return mapped;
    });

    if (studentErrors.length > 0) {
      this.logger.warn(
        `Migracao bloqueada por validacao de estudantes: turma=${classroomId}, inconsistencias=${studentErrors.length}`,
      );
      throw new BadRequestException({
        message: 'Existem estudantes com dados obrigatorios faltando ou invalidos',
        students: studentErrors,
      });
    }

    const idempotencyKey = `${classroomId}:${dto.project}:${dto.year}`;
    const existingRequest = this.inFlightByKey.get(idempotencyKey);
    if (existingRequest) {
      this.logger.warn(`Requisicao duplicada em andamento reaproveitada: key=${idempotencyKey}`);
      return existingRequest;
    }

    const payload = {
      project: dto.project,
      name: dto.name,
      year: dto.year,
      registration: registration.filter((item) => item !== null),
    };
    this.logger.log(
      `Iniciando envio de migracao: key=${idempotencyKey}, classroom=${classroomId}, registrations=${payload.registration.length}`,
    );

    const requestPromise = this.sendWithResilience(payload);
    this.inFlightByKey.set(idempotencyKey, requestPromise);

    try {
      const result = await requestPromise;
      this.logger.log(`Migracao concluida com sucesso: key=${idempotencyKey}`);
      return result;
    } finally {
      this.inFlightByKey.delete(idempotencyKey);
    }
  }

  private mapStudent(
    record: student_data,
  ):
    | {
        name: string;
        birthday: string;
        cpf: string;
        sex: number;
        color_race: number;
        deficiency: boolean;
        zone: number;
      }
    | { errors: string[] } {
    const errors: string[] = [];
    const name = String(record.name ?? '').trim();
    if (!name) errors.push('name');

    const birthday = this.convertDate(record.birthday);
    if (!birthday) errors.push('birthday');

    const cpf = this.sanitizeCpf(record.cpf);
    if (!cpf) errors.push('cpf');

    const sex = this.toInteger(record.sex);
    if (sex === null) errors.push('sex');

    const colorRace = this.toInteger(record.color_race);
    if (colorRace === null) errors.push('color_race');

    const zone = this.toInteger(record.zone);
    if (zone === null) errors.push('zone');

    if (
      errors.length > 0 ||
      !birthday ||
      !cpf ||
      sex === null ||
      colorRace === null ||
      zone === null
    ) {
      return { errors };
    }

    return {
      name,
      birthday,
      cpf,
      sex,
      color_race: colorRace,
      deficiency: Boolean(record.deficiency ?? false),
      zone,
    };
  }

  private sanitizeCpf(cpf: string | null): string | null {
    if (!cpf) return null;
    const digits = cpf.replace(/\D/g, '');
    return digits.length > 0 ? digits : null;
  }

  private toInteger(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null;
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) return null;
    return parsed;
  }

  private convertDate(date: string | null | undefined): string | null {
    if (!date) return null;
    const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(date.trim());
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    const isValidDate =
      parsedDate.getUTCFullYear() === year &&
      parsedDate.getUTCMonth() === month - 1 &&
      parsedDate.getUTCDate() === day;

    if (!isValidDate) return null;

    return `${match[3]}-${match[2]}-${match[1]}`;
  }

  private async sendWithResilience(payload: {
    project: number;
    name: string;
    year: number;
    registration: Array<{
      name: string;
      birthday: string;
      cpf: string;
      sex: number;
      color_race: number;
      deficiency: boolean;
      zone: number;
    }>;
  }): Promise<unknown> {
    try {
      const response = await this.requestWithRetry(() =>
        axios.post(`${this.baseUrl}?token=${this.token}`, payload, { timeout: this.timeoutMs }),
      );
      return response.data;
    } catch (error) {
      this.logExternalError('sendStudents', error);
      console.log(error)
      this.throwMappedExternalError(error, 'Falha ao enviar dados para o MeuBen');
    }
  }

  private async requestWithRetry<T>(request: () => Promise<AxiosResponse<T>>): Promise<AxiosResponse<T>> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      try {
        return await request();
      } catch (error) {
        lastError = error;
        if (!this.isTransientError(error) || attempt === this.maxRetries) break;
        const backoffMs = 250 * (attempt + 1);
        await this.sleep(backoffMs);
      }
    }

    throw lastError;
  }

  private isTransientError(error: unknown): boolean {
    if (!axios.isAxiosError(error)) return false;
    const status = error.response?.status;
    if (status && status >= 500) return true;
    return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT';
  }

  private throwMappedExternalError(error: unknown, defaultMessage: string): never {
    if (!axios.isAxiosError(error)) throw new InternalServerErrorException(defaultMessage);

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      throw new InternalServerErrorException('Servico externo indisponivel por timeout. Tente novamente');
    }

    const status = error.response?.status;

    if (status === 400) {
      throw new BadRequestException('Dados rejeitados pela integracao externa. Revise os dados e tente novamente');
    }

    if (status === 401 || status === 403) {
      throw new InternalServerErrorException('Falha de autenticacao com servico externo');
    }

    if (status && status >= 500) {
      throw new InternalServerErrorException('Servico externo indisponivel no momento. Tente novamente');
    }

    throw new InternalServerErrorException(defaultMessage);
  }

  private logExternalError(context: 'getProjects' | 'sendStudents', error: unknown): void {
    if (!axios.isAxiosError(error)) {
      this.logger.error(`${context} falhou com erro nao mapeado`);
      return;
    }

    const status = error.response?.status;
    const code = error.code ?? 'UNKNOWN';
    const method = error.config?.method?.toUpperCase() ?? 'UNKNOWN';
    const url = this.redactToken(error.config?.url);

    this.logger.error(
      `${context} falhou na integracao externa: method=${method} url=${url} status=${status ?? 'N/A'} code=${code}`,
    );
  }

  private redactToken(value: string | undefined): string {
    if (!value) return 'N/A';
    return value.replace(/token=[^&]+/gi, 'token=***');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private normalizeProjectsResponse(raw: unknown): Array<{ id: number; name: string }> {
    if (!Array.isArray(raw)) return [];

    return raw
      .flatMap((item) => {
        const projects = (item as { project?: unknown[] })?.project;
        return Array.isArray(projects) ? projects : [];
      })
      .filter(
        (project): project is { id: unknown; name: unknown; active?: unknown } =>
          !!project && typeof project === 'object',
      )
      .filter((project) => project.active !== false)
      .map((project) => ({
        id: Number(project.id),
        name: String(project.name ?? '').trim(),
      }))
      .filter((project) => Number.isInteger(project.id) && project.id > 0 && project.name.length > 0);
  }
}
