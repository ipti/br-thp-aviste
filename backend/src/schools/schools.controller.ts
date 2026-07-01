import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser, JwtPayload } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { SchoolResponseDto } from './dto/school-response.dto';

@ApiTags('schools')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiCreatedResponse({ type: SchoolResponseDto })
  create(@Body() dto: CreateSchoolDto): Promise<SchoolResponseDto> {
    return this.schoolsService.create(dto);
  }

  @Get()
  @ApiOkResponse({ type: [SchoolResponseDto] })
  findAll(@CurrentUser() user: JwtPayload): Promise<SchoolResponseDto[]> {
    return this.schoolsService.findAll(user);
  }

  @Get(':id')
  @ApiOkResponse({ type: SchoolResponseDto })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ): Promise<SchoolResponseDto> {
    return this.schoolsService.findOne(id, user);
  }

  @Get(':id/stats')
  @ApiOkResponse()
  getStats(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.schoolsService.getStats(id, user);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiOkResponse({ type: SchoolResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSchoolDto,
  ): Promise<SchoolResponseDto> {
    return this.schoolsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(204)
  @ApiNoContentResponse()
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.schoolsService.remove(id);
  }
}

