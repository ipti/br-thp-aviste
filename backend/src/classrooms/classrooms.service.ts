import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { getAllowedSchoolIds } from '../common/access/school-access';
import { JwtPayload } from '../common/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

const SCHOOL_SELECT = { select: { id: true, name: true } } as const;

@Injectable()
export class ClassroomsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateClassroomDto, user: JwtPayload) {
    if (user.role !== Role.ADMIN) {
      const relation = await this.prisma.user_school.findFirst({
        where: { user_fk: user.id, school_fk: dto.school_fk },
      });

      if (!relation) throw new ForbiddenException('Acesso negado para esta escola');
    }

    return this.prisma.classroom.create({
      data: dto,
      include: { school: SCHOOL_SELECT },
    });
  }

  async findAll(user: JwtPayload, schoolId?: number) {
    const allowedSchoolIds = await getAllowedSchoolIds(this.prisma, user);

    if (allowedSchoolIds && schoolId && !allowedSchoolIds.includes(schoolId)) {
      throw new ForbiddenException('Acesso negado para esta escola');
    }

    const schoolFilter = schoolId
      ? { school_fk: schoolId }
      : allowedSchoolIds
        ? { school_fk: { in: allowedSchoolIds } }
        : {};

    return this.prisma.classroom.findMany({
      where: schoolFilter,
      include: { school: SCHOOL_SELECT },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number, user: JwtPayload) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
      include: { school: SCHOOL_SELECT },
    });
    if (!classroom) throw new NotFoundException('Turma não encontrada');

    if (user.role !== Role.ADMIN) {
      const relation = await this.prisma.user_school.findFirst({
        where: { user_fk: user.id, school_fk: classroom.school_fk },
      });
      if (!relation) throw new ForbiddenException('Acesso negado para esta escola');
    }

    return classroom;
  }

  async update(id: number, dto: UpdateClassroomDto, user: JwtPayload) {
    await this.findOne(id, user);

    if (user.role !== Role.ADMIN && dto.school_fk) {
      const relation = await this.prisma.user_school.findFirst({
        where: { user_fk: user.id, school_fk: dto.school_fk },
      });
      if (!relation) throw new ForbiddenException('Acesso negado para esta escola');
    }

    return this.prisma.classroom.update({
      where: { id },
      data: dto,
      include: { school: SCHOOL_SELECT },
    });
  }

  async remove(id: number, user: JwtPayload): Promise<void> {
    await this.findOne(id, user);
    await this.prisma.classroom.delete({ where: { id } });
  }
}

