import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsInt, Max, Min } from 'class-validator';

export class UpdateQuestionnaireDto {
  @ApiProperty({ description: '"0"=Não usa óculos, "1"=Usa óculos' })
  @IsIn(['0', '1'])
  filho_oculos: string;

  @ApiProperty({ description: '1=<1h, 2=1-2h, 3=2-4h, 4=4-8h, 5=>8h' })
  @IsInt() @Min(1) @Max(5)
  horas_uso_aparelhos_eletronicos: number;

  @ApiProperty({ description: '1=<30min, 2=30min-1h, 3=1-2h, 4=>2h' })
  @IsInt() @Min(1) @Max(4)
  horas_atividades_ao_ar_livre: number;

  // Sintomas da criança
  @ApiProperty() @IsBoolean() dificuldade_quadro: boolean;
  @ApiProperty() @IsBoolean() dificuldade_livro: boolean;
  @ApiProperty() @IsBoolean() olho_torto_constante: boolean;
  @ApiProperty() @IsBoolean() olho_torto_momentos: boolean;
  @ApiProperty() @IsBoolean() rosto_aperta_olhos: boolean;
  @ApiProperty() @IsBoolean() tremor_olhos: boolean;
  @ApiProperty() @IsBoolean() mancha_branca_pupila: boolean;

  // Doenças oculares
  @ApiProperty() @IsBoolean() olho_preguicoso: boolean;
  @ApiProperty() @IsBoolean() olho_torto_doenca: boolean;
  @ApiProperty() @IsBoolean() catarata_infancia: boolean;
  @ApiProperty() @IsBoolean() glaucoma_congenito: boolean;
  @ApiProperty() @IsBoolean() tumor_olhos: boolean;
  @ApiProperty() @IsBoolean() ceratocone_transplante: boolean;
  @ApiProperty() @IsBoolean() palpebra_caida: boolean;

  // Histórico familiar
  @ApiProperty() @IsBoolean() miopia_ambos_pais: boolean;
  @ApiProperty() @IsBoolean() miopia_um_pai: boolean;
  @ApiProperty() @IsBoolean() hipermetropia_astigmatismo: boolean;
  @ApiProperty() @IsBoolean() estrabismo: boolean;
  @ApiProperty() @IsBoolean() catarata_glaucoma: boolean;
  @ApiProperty() @IsBoolean() olho_preguicoso_familiar: boolean;
  @ApiProperty() @IsBoolean() tumor_olho_familiar: boolean;

  // Condições médicas gerais
  @ApiProperty() @IsBoolean() prematuridade: boolean;
  @ApiProperty() @IsBoolean() sindrome_down: boolean;
  @ApiProperty() @IsBoolean() paralisia_tumor_cerebral: boolean;
  @ApiProperty() @IsBoolean() outras_sindromes_geneticas: boolean;
  @ApiProperty() @IsBoolean() diabetes: boolean;
  @ApiProperty() @IsBoolean() artrite_artrose: boolean;
  @ApiProperty() @IsBoolean() alergias_corticoides: boolean;
}
