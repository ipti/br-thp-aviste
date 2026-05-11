import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { ClassroomResponseDto } from './dto/classroom-response.dto';

@ApiTags('classrooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TRIADOR)
  @ApiCreatedResponse({ type: ClassroomResponseDto })
  create(@Body() dto: CreateClassroomDto): Promise<ClassroomResponseDto> {
    return this.classroomsService.create(dto) as Promise<ClassroomResponseDto>;
  }

  @Get()
  @ApiOkResponse({ type: [ClassroomResponseDto] })
  @ApiQuery({ name: 'schoolId', required: false, type: Number })
  findAll(@Query('schoolId') schoolId?: string): Promise<ClassroomResponseDto[]> {
    return this.classroomsService.findAll(schoolId ? Number(schoolId) : undefined) as Promise<ClassroomResponseDto[]>;
  }

  @Get(':id')
  @ApiOkResponse({ type: ClassroomResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ClassroomResponseDto> {
    return this.classroomsService.findOne(id) as Promise<ClassroomResponseDto>;
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.TRIADOR)
  @ApiOkResponse({ type: ClassroomResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClassroomDto,
  ): Promise<ClassroomResponseDto> {
    return this.classroomsService.update(id, dto) as Promise<ClassroomResponseDto>;
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  @ApiNoContentResponse()
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.classroomsService.remove(id);
  }
}
