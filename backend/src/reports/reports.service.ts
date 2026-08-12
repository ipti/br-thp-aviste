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
    const schools = await this.prisma.school.findMany({
      where: filter?.schoolIds?.length ? { id: { in: filter.schoolIds } } : undefined,
      orderBy: { name: 'asc' },
    });

    return Promise.all(
      schools.map(async (school) => {
        const [allStudents, countClassroom] = await Promise.all([
          this.prisma.student_data.findMany({ where: { school_fk: school.id } }),
          this.prisma.classroom.count({ where: { school_fk: school.id } }),
        ]);

        const students = filter ? this.applyFilter(allStudents, filter) : allStudents;

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

  private applyFilter(students: student_data[], f: GeneralReportFilterDto): student_data[] {
    return students.filter((s) => {
      if (f.startDate && f.endDate) {
        const end = endOfDay(f.endDate);
        if (s.createdAt < new Date(f.startDate) || s.createdAt > end) return false;
      }
      if (f.triagemStart && f.triagemEnd) {
        const end = endOfDay(f.triagemEnd);
        if (!s.data_triagem || s.data_triagem < new Date(f.triagemStart) || s.data_triagem > end) return false;
      }
      if (f.consultaStart && f.consultaEnd) {
        const end = endOfDay(f.consultaEnd);
        if (!s.data_consulta || s.data_consulta < new Date(f.consultaStart) || s.data_consulta > end) return false;
      }
      if (f.entregaStart && f.entregaEnd) {
        const end = endOfDay(f.entregaEnd);
        if (!s.data_entrega_oculos || s.data_entrega_oculos < new Date(f.entregaStart) || s.data_entrega_oculos > end) return false;
      }
      return true;
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
