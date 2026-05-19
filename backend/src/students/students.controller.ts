import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { UpdateScreeningDto } from './dto/update-screening.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { UpdateGlassesDeliveryDto } from './dto/update-glasses-delivery.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentResponseDto } from './dto/student-response.dto';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TRIADOR)
  @ApiCreatedResponse({ type: StudentResponseDto })
  create(
    @Body() dto: CreateStudentDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<StudentResponseDto> {
    return this.studentsService.create(dto, user) as Promise<StudentResponseDto>;
  }

  @Get()
  @ApiOkResponse({ type: [StudentResponseDto] })
  @ApiQuery({ name: 'classroomId', required: false, type: Number })
  @ApiQuery({ name: 'schoolId', required: false, type: Number })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query('classroomId') classroomId?: string,
    @Query('schoolId') schoolId?: string,
  ): Promise<StudentResponseDto[]> {
    return this.studentsService.findAll(user, {
      classroomId: classroomId ? Number(classroomId) : undefined,
      schoolId: schoolId ? Number(schoolId) : undefined,
    }) as Promise<StudentResponseDto[]>;
  }

  @Get(':id')
  @ApiOkResponse({ type: StudentResponseDto })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ): Promise<StudentResponseDto> {
    return this.studentsService.findOne(id, user) as Promise<StudentResponseDto>;
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.TRIADOR)
  @ApiOkResponse({ type: StudentResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<StudentResponseDto> {
    return this.studentsService.update(id, dto, user) as Promise<StudentResponseDto>;
  }

  @Put(':id/questionnaire')
  @Roles(Role.ADMIN, Role.TRIADOR)
  @ApiOkResponse({ type: StudentResponseDto })
  updateQuestionnaire(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateQuestionnaireDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<StudentResponseDto> {
    return this.studentsService.updateQuestionnaire(id, dto, user) as Promise<StudentResponseDto>;
  }

  @Put(':id/screening')
  @Roles(Role.ADMIN, Role.TRIADOR)
  @ApiOkResponse({ type: StudentResponseDto })
  updateScreening(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateScreeningDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<StudentResponseDto> {
    return this.studentsService.updateScreening(id, dto, user) as Promise<StudentResponseDto>;
  }

  @Put(':id/prescription')
  @Roles(Role.ADMIN, Role.MEDICO)
  @ApiOkResponse({ type: StudentResponseDto })
  updatePrescription(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePrescriptionDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<StudentResponseDto> {
    return this.studentsService.updatePrescription(id, dto, user) as Promise<StudentResponseDto>;
  }

  @Put(':id/consultation')
  @Roles(Role.ADMIN, Role.MEDICO)
  @ApiOkResponse({ type: StudentResponseDto })
  updateConsultation(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsultationDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<StudentResponseDto> {
    return this.studentsService.updateConsultation(id, dto, user) as Promise<StudentResponseDto>;
  }

  @Put(':id/glasses-delivered')
  @Roles(Role.ADMIN)
  @ApiOkResponse({ type: StudentResponseDto })
  markGlassesDelivered(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGlassesDeliveryDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<StudentResponseDto> {
    return this.studentsService.markGlassesDelivered(id, dto, user) as Promise<StudentResponseDto>;
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  @ApiNoContentResponse()
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    return this.studentsService.remove(id, user);
  }
}

