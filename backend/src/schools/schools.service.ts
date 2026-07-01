import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { getAllowedSchoolIds } from '../common/access/school-access';
import { JwtPayload } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { SchoolResponseDto } from './dto/school-response.dto';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSchoolDto): Promise<SchoolResponseDto> {
    return this.prisma.school.create({ data: dto });
  }

  async findAll(user: JwtPayload): Promise<SchoolResponseDto[]> {
    const allowedSchoolIds = await getAllowedSchoolIds(this.prisma, user);

    return this.prisma.school.findMany({
      where: allowedSchoolIds ? { id: { in: allowedSchoolIds } } : undefined,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number, user: JwtPayload): Promise<SchoolResponseDto> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new NotFoundException('Escola não encontrada');

    if (user.role !== Role.ADMIN) {
      const relation = await this.prisma.user_school.findFirst({
        where: { user_fk: user.id, school_fk: id },
      });

      if (!relation) throw new ForbiddenException('Acesso negado para esta escola');
    }

    return school;
  }

  async update(id: number, dto: UpdateSchoolDto): Promise<SchoolResponseDto> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new NotFoundException('Escola não encontrada');
    return this.prisma.school.update({ where: { id }, data: dto });
  }

  async getStats(id: number, user: JwtPayload) {
    await this.findOne(id, user);

    const [totalClassrooms, students] = await Promise.all([
      this.prisma.classroom.count({ where: { school_fk: id } }),
      this.prisma.student_data.findMany({
        where: { school_fk: id },
        select: { birthday: true, consulta_concluida: true },
      }),
    ]);

    const today = new Date();
    let students5to12 = 0;
    let totalConsultations = 0;

    for (const s of students) {
      if (s.consulta_concluida) totalConsultations++;

      const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s.birthday);
      if (m) {
        const birth = new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
        let age = today.getFullYear() - birth.getFullYear();
        const mo = today.getMonth() - birth.getMonth();
        if (mo < 0 || (mo === 0 && today.getDate() < birth.getDate())) age--;
        if (age >= 5 && age <= 12) students5to12++;
      }
    }

    return {
      total_classrooms:  totalClassrooms,
      total_students:    students.length,
      total_consultations: totalConsultations,
      students_5_to_12:  students5to12,
    };
  }

  async remove(id: number): Promise<void> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new NotFoundException('Escola não encontrada');
    await this.prisma.school.delete({ where: { id } });
  }
}

