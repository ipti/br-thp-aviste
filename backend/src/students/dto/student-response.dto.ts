import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() classroom_fk: number;
  @ApiProperty() school_fk: number;
  @ApiProperty() name: string;
  @ApiProperty() birthday: string;
  @ApiPropertyOptional() cpf?: string | null;
  @ApiProperty() sex: number;
  @ApiProperty() color_race: number;
  @ApiProperty() zone: number;
  @ApiProperty() deficiency: boolean;
  @ApiPropertyOptional() turno?: string | null;
  @ApiProperty() permission: boolean;
  @ApiProperty() points: number;
  @ApiProperty() questionario_pais_concluido: boolean;
  @ApiProperty() triagem_concluida: boolean;
  @ApiProperty() receita_oculos_concluida: boolean;
  @ApiProperty() consulta_concluida: boolean;
  @ApiProperty() entrega_oculos_concluida: boolean;
  @ApiPropertyOptional() data_entrega_oculos?: string | null;
  @ApiPropertyOptional() responsavel_entrega_oculos?: string | null;
  @ApiPropertyOptional() atendimento_oftalmologico_previo?: string | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
