import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateConsultationDto {
  @ApiProperty({ example: '28/04/2026' }) @IsString() data_consulta: string;
  @ApiProperty({ example: '12345-SP' }) @IsString() crm_medico: string;
  @ApiProperty({ example: 'Dr. Carlos Souza' }) @IsString() nome_medico: string;
}
