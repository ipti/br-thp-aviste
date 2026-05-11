import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

const SCHOOL_SELECT = { select: { id: true, name: true } } as const;

@Injectable()
export class ClassroomsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateClassroomDto) {
    return this.prisma.classroom.create({
      data: dto,
      include: { school: SCHOOL_SELECT },
    });
  }

  findAll(schoolId?: number) {
    return this.prisma.classroom.findMany({
      where: schoolId ? { school_fk: schoolId } : undefined,
      include: { school: SCHOOL_SELECT },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
      include: { school: SCHOOL_SELECT },
    });
    if (!classroom) throw new NotFoundException('Turma não encontrada');
    return classroom;
  }

  async update(id: number, dto: UpdateClassroomDto) {
    await this.findOne(id);
    return this.prisma.classroom.update({
      where: { id },
      data: dto,
      include: { school: SCHOOL_SELECT },
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.classroom.delete({ where: { id } });
  }
}
