import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SchoolResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiPropertyOptional() total_alunos_participantes?: number | null;
  @ApiProperty() createdAt: Date;
}
