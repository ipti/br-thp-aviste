import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ConsultationsService } from './consultations.service';
import { ConsultationItemDto } from './dto/consultation-response.dto';

@ApiTags('consultations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get()
  @Roles(Role.ADMIN, Role.MEDICO)
  @ApiOkResponse({ type: [ConsultationItemDto] })
  @ApiQuery({ name: 'schoolId', required: false, type: Number })
  findForwarded(@Query('schoolId') schoolId?: string): Promise<ConsultationItemDto[]> {
    return this.consultationsService.findForwarded(schoolId ? Number(schoolId) : undefined);
  }
}
