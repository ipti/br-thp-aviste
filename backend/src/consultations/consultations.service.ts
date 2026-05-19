import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConsultationItemDto } from './dto/consultation-response.dto';
import { JwtPayload } from '../common/decorators/current-user.decorator';
import { getAllowedSchoolIds } from '../common/access/school-access';

const THRESHOLD = 5;

const resolvePriority = (points: number): string => {
  if (points >= 10) return 'Máxima';
  if (points >= 5) return 'Média';
  return 'Mínima';
};

@Injectable()
export class ConsultationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findForwarded(user: JwtPayload, schoolId?: number): Promise<ConsultationItemDto[]> {
    const allowedSchoolIds = await getAllowedSchoolIds(this.prisma, user);

    if (allowedSchoolIds && schoolId && !allowedSchoolIds.includes(schoolId)) {
      throw new ForbiddenException('Acesso negado para esta escola');
    }

    const records = await this.prisma.student_data.findMany({
      where: {
        points: { gte: THRESHOLD },
        ...(schoolId && { school_fk: schoolId }),
        ...(allowedSchoolIds ? { school_fk: { in: allowedSchoolIds } } : {}),
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

