import { Injectable, NotFoundException } from '@nestjs/common';
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

  findAll(): Promise<SchoolResponseDto[]> {
    return this.prisma.school.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number): Promise<SchoolResponseDto> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new NotFoundException('Escola não encontrada');
    return school;
  }

  async update(id: number, dto: UpdateSchoolDto): Promise<SchoolResponseDto> {
    await this.findOne(id);
    return this.prisma.school.update({ where: { id }, data: dto });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.school.delete({ where: { id } });
  }
}
