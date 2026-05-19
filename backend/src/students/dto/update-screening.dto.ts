import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

const ACUIDADE = ['1', '2', '3', '4', '5', '6', '7', '8', 'nenhum'] as const;

export class UpdateScreeningDto {
  @ApiProperty({ enum: ACUIDADE, description: 'Resultado da acuidade — 1 (melhor) a 8 ou nenhum' })
  @IsIn(ACUIDADE)
  acuidade_triagem_direito: string;

  @ApiProperty({ enum: ACUIDADE })
  @IsIn(ACUIDADE)
  acuidade_triagem_esquerdo: string;

  @ApiProperty({ description: '"0"=Passou, "1"=Falhou' })
  @IsIn(['0', '1'])
  test_cover: string;

  @ApiProperty({ description: '"0"=Passou, "1"=Falhou' })
  @IsIn(['0', '1'])
  test_movimento_ocular: string;

  @ApiProperty({ description: '"0"=Passou, "1"=Falhou' })
  @IsIn(['0', '1'])
  test_mancha_branca: string;

  @ApiProperty({ description: '"0"=Não, "1"=Sim' })
  @IsIn(['0', '1'])
  atendimento_oftalmologico_previo: string;
}
