import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateClassroomDto {
  @ApiProperty({ example: '5º Ano A' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  school_fk: number;

  @ApiPropertyOptional({ example: '2026' })
  @IsOptional()
  @IsString()
  year?: string;
}
