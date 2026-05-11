import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConsultationItemDto } from './dto/consultation-response.dto';

const THRESHOLD = 5;

const resolvePriority = (points: number): string => {
  if (points >= 10) return 'Máxima';
  if (points >= 5) return 'Média';
  return 'Mínima';
};

@Injectable()
export class ConsultationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findForwarded(schoolId?: number): Promise<ConsultationItemDto[]> {
    const records = await this.prisma.student_data.findMany({
      where: {
        points: { gte: THRESHOLD },
        ...(schoolId && { school_fk: schoolId }),
      },
      include: {
        classroom: { select: { name: true } },
        school: { select: { name: true } },
      },
      orderBy: [{ school: { name: 'asc' } }, { classroom: { name: 'asc' } }],
    });

    return records.map((r) => ({
      schoolId: r.school_fk,
      school: r.school.name,
      classroomId: r.classroom_fk,
      classroom: r.classroom.name,
      studentDataId: r.id,
      studentName: r.name,
      birthday: r.birthday,
      points: r.points,
      priority: resolvePriority(r.points),
    }));
  }
}
