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

  async remove(id: number): Promise<void> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new NotFoundException('Escola não encontrada');
    await this.prisma.school.delete({ where: { id } });
  }
}

