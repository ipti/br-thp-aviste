import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, Matches, Min } from 'class-validator';

export class PostMigrationDto {
  @ApiProperty({ description: 'ID do projeto no meuben', example: 123 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  project: number;

  @ApiProperty({ description: 'Nome da turma no meuben' })
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: 'name nao pode conter apenas espacos' })
  name: string;

  @ApiProperty({ example: 2026 })
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  year: number;

  @ApiProperty({ description: 'ID da turma no visao', example: 10, required: false })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  id?: number;

  @ApiProperty({
    description: 'Campo legado de ID da turma no visao (retrocompatibilidade)',
    example: 10,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  classroom_fk?: number;
}
