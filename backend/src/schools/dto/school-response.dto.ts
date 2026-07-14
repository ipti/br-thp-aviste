import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SchoolResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiPropertyOptional() total_alunos_escola?: number | null;
  @ApiProperty() createdAt: Date;
}
