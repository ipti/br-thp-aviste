import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty() @IsInt() @Min(0) classroom_fk: number;
  @ApiProperty() @IsInt() @Min(0) school_fk: number;

  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: '15/03/2015', description: 'DD/MM/YYYY' })
  @IsString()
  birthday: string;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({ description: '0=Masculino, 1=Feminino' })
  @IsInt()
  @Min(0)
  @Max(1)
  sex: number;

  @ApiProperty({ description: '0=Branca, 1=Preta, 2=Parda, 3=Amarela, 4=Indígena, 5=Não declarada' })
  @IsInt()
  @Min(0)
  @Max(5)
  color_race: number;

  @ApiProperty({ description: '0=Urbana, 1=Rural' })
  @IsInt()
  @Min(0)
  @Max(1)
  zone: number;

  @ApiProperty() @IsBoolean() deficiency: boolean;

  @ApiPropertyOptional({ description: 'Manhã | Tarde | Noite | Integral' })
  @IsOptional()
  @IsString()
  turno?: string;

  @ApiProperty() @IsBoolean() permission: boolean;

  @ApiPropertyOptional() @IsOptional() @IsString() telephone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responsable_name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responsable_cpf?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responsable_telephone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() responsable_email?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() is_legal_responsible?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() image_sharing_not_authorized?: boolean;
}
