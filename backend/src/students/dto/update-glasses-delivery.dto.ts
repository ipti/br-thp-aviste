import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Matches, MinLength } from 'class-validator';

export class UpdateGlassesDeliveryDto {
  @ApiProperty({ example: '08/05/2026', description: 'DD/MM/YYYY' })
  @IsString()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'data_entrega_oculos deve estar no formato DD/MM/YYYY' })
  data_entrega_oculos: string;

  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @MinLength(2)
  responsavel_entrega_oculos: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  entrega_oculos_confirmada: boolean;
}
