import { Injectable, NotFoundException } from '@nestjs/common';
import { student_data } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PointsService } from '../points/points.service';
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

  create(dto: CreateStudentDto): Promise<student_data> {
    return this.prisma.student_data.create({ data: dto });
  }

  findAll(params: { classroomId?: number; schoolId?: number }): Promise<student_data[]> {
    return this.prisma.student_data.findMany({
      where: {
        ...(params.classroomId && { classroom_fk: params.classroomId }),
        ...(params.schoolId && { school_fk: params.schoolId }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number): Promise<student_data> {
    const student = await this.prisma.student_data.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Aluno não encontrado');
    return student;
  }

  async update(id: number, dto: UpdateStudentDto): Promise<student_data> {
    await this.findOne(id);
    return this.prisma.student_data.update({ where: { id }, data: dto });
  }

  async updateQuestionnaire(id: number, dto: UpdateQuestionnaireDto): Promise<student_data> {
    await this.findOne(id);
    return this.prisma.student_data.update({
      where: { id },
      data: { ...dto, questionario_pais_concluido: true },
    });
  }

  async updateScreening(id: number, dto: UpdateScreeningDto): Promise<student_data> {
    await this.findOne(id);
    const updated = await this.prisma.student_data.update({
      where: { id },
      data: { ...dto, triagem_concluida: true },
    });
    const points = this.pointsService.calculate(updated);
    return this.prisma.student_data.update({ where: { id }, data: { points } });
  }

  async updatePrescription(id: number, dto: UpdatePrescriptionDto): Promise<student_data> {
    await this.findOne(id);
    return this.prisma.student_data.update({
      where: { id },
      data: { ...dto, receita_oculos_concluida: true },
    });
  }

  async updateConsultation(id: number, dto: UpdateConsultationDto): Promise<student_data> {
    await this.findOne(id);
    return this.prisma.student_data.update({
      where: { id },
      data: { ...dto, consulta_concluida: true },
    });
  }

  async markGlassesDelivered(id: number, dto: UpdateGlassesDeliveryDto): Promise<student_data> {
    await this.findOne(id);
    return this.prisma.student_data.update({
      where: { id },
      data: {
        data_entrega_oculos: dto.data_entrega_oculos,
        responsavel_entrega_oculos: dto.responsavel_entrega_oculos,
        entrega_oculos_concluida: dto.entrega_oculos_confirmada,
      } as never,
    });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.student_data.delete({ where: { id } });
  }
}
