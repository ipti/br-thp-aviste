import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, student_data } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PointsService } from '../points/points.service';
import { JwtPayload } from '../common/decorators/current-user.decorator';
import { getAllowedSchoolIds } from '../common/access/school-access';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { UpdateGlassesDeliveryDto } from './dto/update-glasses-delivery.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pointsService: PointsService,
  ) {}

  private async ensureSchoolAccess(user: JwtPayload, schoolId: number): Promise<void> {
    if (user.role === Role.ADMIN) return;

    const relation = await this.prisma.user_school.findFirst({
      where: { user_fk: user.id, school_fk: schoolId },
    });

    if (!relation) throw new ForbiddenException('Acesso negado para esta escola');
  }

  async create(dto: CreateStudentDto, user: JwtPayload): Promise<student_data> {
    await this.ensureSchoolAccess(user, dto.school_fk);
    return this.prisma.student_data.create({ data: dto });
  }

  async findAll(
    user: JwtPayload,
    params: { classroomId?: number; schoolId?: number },
  ): Promise<student_data[]> {
    const allowedSchoolIds = await getAllowedSchoolIds(this.prisma, user);

    if (allowedSchoolIds && params.schoolId && !allowedSchoolIds.includes(params.schoolId)) {
      throw new ForbiddenException('Acesso negado para esta escola');
    }

    return this.prisma.student_data.findMany({
      where: {
        ...(params.classroomId && { classroom_fk: params.classroomId }),
        ...(params.schoolId && { school_fk: params.schoolId }),
        ...(allowedSchoolIds ? { school_fk: { in: allowedSchoolIds } } : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number, user: JwtPayload): Promise<student_data> {
    const student = await this.prisma.student_data.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Aluno não encontrado');

    await this.ensureSchoolAccess(user, student.school_fk);
    return student;
  }

  async update(id: number, dto: UpdateStudentDto, user: JwtPayload): Promise<student_data> {
    const current = await this.findOne(id, user);
    await this.ensureSchoolAccess(user, current.school_fk);
    return this.prisma.student_data.update({ where: { id }, data: dto });
  }

  async updateQuestionnaire(id: number, dto: UpdateQuestionnaireDto, user: JwtPayload): Promise<student_data> {
    await this.findOne(id, user);
    return this.prisma.student_data.update({
      where: { id },
      data: { ...dto, questionario_pais_concluido: true },
    });
  }

  async updateScreening(id: number, dto: UpdateScreeningDto, user: JwtPayload): Promise<student_data> {
    await this.findOne(id, user);
    const updated = await this.prisma.student_data.update({
      where: { id },
      data: { ...dto, triagem_concluida: true },
    });
    const points = this.pointsService.calculate(updated);
    return this.prisma.student_data.update({ where: { id }, data: { points } });
  }

  async updatePrescription(id: number, dto: UpdatePrescriptionDto, user: JwtPayload): Promise<student_data> {
    await this.findOne(id, user);
    return this.prisma.student_data.update({
      where: { id },
      data: { ...dto, receita_oculos_concluida: true },
    });
  }

  async updateConsultation(id: number, dto: UpdateConsultationDto, user: JwtPayload): Promise<student_data> {
    await this.findOne(id, user);
    return this.prisma.student_data.update({
      where: { id },
      data: { ...dto, consulta_concluida: true },
    });
  }

  async markGlassesDelivered(id: number, dto: UpdateGlassesDeliveryDto, user: JwtPayload): Promise<student_data> {
    await this.findOne(id, user);
    return this.prisma.student_data.update({
      where: { id },
      data: {
        data_entrega_oculos: dto.data_entrega_oculos,
        responsavel_entrega_oculos: dto.responsavel_entrega_oculos,
        entrega_oculos_concluida: dto.entrega_oculos_confirmada,
      } as never,
    });
  }

  async remove(id: number, user: JwtPayload): Promise<void> {
    await this.findOne(id, user);
    await this.prisma.student_data.delete({ where: { id } });
  }
}

