import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class UpdateStudentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MinLength(2) name?: string;
  @ApiPropertyOptional({ example: '15/03/2015' }) @IsOptional() @IsString() birthday?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() cpf?: string;
  @ApiPropertyOptional({ description: '0=Masculino, 1=Feminino' }) @IsOptional() @IsInt() @Min(0) @Max(1) sex?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) @Max(5) color_race?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) @Max(1) zone?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() deficiency?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() turno?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() permission?: boolean;
}
