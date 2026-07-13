import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateConsultationDto {
  @ApiProperty({ example: '28/04/2026' }) @IsString() data_consulta: string;
  @ApiProperty({ example: '12345-SP' })   @IsString() crm_medico: string;
  @ApiProperty({ example: 'Dr. Carlos Souza' }) @IsString() nome_medico: string;

  // Spot Vision OD
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) spot_esferico_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) spot_cilindrico_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) spot_eixo_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) spot_eq_esferico_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) spot_dp_od?: string;
  // Spot Vision OE
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) spot_esferico_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) spot_cilindrico_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) spot_eixo_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) spot_eq_esferico_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) spot_dp_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() spot_observacao?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() anamnese?: string;

  // Refração Estática OD
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) ref_estatica_esferico_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) ref_estatica_cilindrico_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) ref_estatica_eixo_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) ref_estatica_acuidade_od?: string;
  // Refração Estática OE
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) ref_estatica_esferico_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) ref_estatica_cilindrico_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) ref_estatica_eixo_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(20) ref_estatica_acuidade_oe?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() biomicroscopia_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() biomicroscopia_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fundoscopia_od?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fundoscopia_oe?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() motilidade_ocular?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() diagnostico?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() conduta?: string;
  @ApiPropertyOptional() @IsOptional() @IsIn(['0', '1']) precisa_oculos?: string;

  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_ambliopia?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_retinoblastoma?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_catarata_congenita?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_obstrucao_lacrimais?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_estrabismo?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_glaucoma_congenito?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_uveites?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_nistagmo?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_miopia_progressiva?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_ectasias_cornea?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_alergias_conjuntivites?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() acomp_baixa_visao_central?: boolean;

  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(10) proxima_consulta_meses?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() observacoes_consulta?: string;
}
