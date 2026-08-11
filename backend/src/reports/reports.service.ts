import { Injectable } from '@nestjs/common';
import { student_data } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SchoolReportDto } from './dto/general-report-response.dto';
import { GeneralReportFilterDto } from './dto/general-report-filter.dto';

function endOfDay(iso: string): Date {
  const d = new Date(iso);
  d.setHours(23, 59, 59, 999);
  return d;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async generalReport(filter?: GeneralReportFilterDto): Promise<SchoolReportDto[]> {
    const hasFilter = filter?.filterField && filter?.startDate && filter?.endDate;
    const start = hasFilter ? new Date(filter.startDate!) : null;
    const end   = hasFilter ? endOfDay(filter.endDate!) : null;

    const schools = await this.prisma.school.findMany({ orderBy: { name: 'asc' } });

    return Promise.all(
      schools.map(async (school) => {
        const [allStudents, countClassroom] = await Promise.all([
          this.prisma.student_data.findMany({ where: { school_fk: school.id } }),
          this.prisma.classroom.count({ where: { school_fk: school.id } }),
        ]);

        const students = hasFilter ? this.applyFilter(allStudents, filter.filterField!, start!, end!) : allStudents;

        return {
          schoolId: school.id,
          school: school.name,
          countClassroom,
          countRegister: students.length,
          countQuestianarioPais: this.countQuestionnaire(students),
          countRegisterTriados: this.countTriaged(students),
          countForwardedConsultation: students.filter((s) => s.points >= 5).length,
          countConsultationCompleted: students.filter((s) => s.consulta_concluida).length,
          countReceitaOculosCompleted: this.countPrescription(students),
          countEntregaOculosCompleted: students.filter((s) => s.entrega_oculos_concluida).length,
        };
      }),
    );
  }

  private applyFilter(
    students: student_data[],
    field: GeneralReportFilterDto['filterField'],
    start: Date,
    end: Date,
  ): student_data[] {
    return students.filter((s) => {
      let date: Date | null = null;

      if (field === 'createdAt') {
        date = s.createdAt;
      } else if (field === 'data_triagem') {
        date = s.data_triagem ?? null;
      } else if (field === 'data_consulta') {
        date = s.data_consulta ?? null;
      } else if (field === 'data_entrega_oculos') {
        date = s.data_entrega_oculos ?? null;
      }

      if (!date) return false;
      return date >= start && date <= end;
    });
  }

  private countQuestionnaire(students: student_data[]): number {
    return students.filter(
      (s) =>
        s.questionario_pais_concluido ||
        (s.horas_atividades_ao_ar_livre !== null && s.horas_uso_aparelhos_eletronicos !== null),
    ).length;
  }

  private countTriaged(students: student_data[]): number {
    return students.filter(
      (s) =>
        s.triagem_concluida ||
        (s.acuidade_triagem_direito &&
          s.acuidade_triagem_esquerdo &&
          s.test_cover &&
          s.test_mancha_branca &&
          s.test_movimento_ocular),
    ).length;
  }

  private countPrescription(students: student_data[]): number {
    return students.filter(
      (s) =>
        s.receita_oculos_concluida ||
        (s.receita_esferico_od && s.receita_cilindrico_od),
    ).length;
  }
}
