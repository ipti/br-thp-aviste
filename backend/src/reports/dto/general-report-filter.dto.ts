import { IsDateString, IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export type ReportFilterField = 'createdAt' | 'data_triagem' | 'data_consulta' | 'data_entrega_oculos';

export class GeneralReportFilterDto {
  @ApiPropertyOptional({ enum: ['createdAt', 'data_triagem', 'data_consulta', 'data_entrega_oculos'] })
  @IsOptional()
  @IsIn(['createdAt', 'data_triagem', 'data_consulta', 'data_entrega_oculos'])
  filterField?: ReportFilterField;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'YYYY-MM-DD' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
