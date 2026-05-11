import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { MigrationService } from './migration.service';
import { PostMigrationDto } from './dto/post-migration.dto';

@ApiTags('migration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('migration')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Get('projects')
  @ApiOkResponse({ description: 'Lista de projetos disponíveis no meuben' })
  getProjects(): Promise<unknown> {
    return this.migrationService.getProjects();
  }

  @Post('send')
  @ApiOkResponse({ description: 'Resultado do envio ao meuben' })
  sendStudents(@Body() dto: PostMigrationDto): Promise<unknown> {
    return this.migrationService.sendStudents(dto);
  }
}
