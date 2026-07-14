import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateSchoolDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MinLength(3) name?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) total_alunos_escola?: number | null;
}
