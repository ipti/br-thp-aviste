import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePrescriptionDto {
  @ApiPropertyOptional() @IsOptional() @IsString() receita_esferico_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() receita_cilindrico_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() receita_eixo_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() receita_esferico_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() receita_cilindrico_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() receita_eixo_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() receita_adicao?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() receita_dp?: string;
}
