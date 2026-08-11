import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsString, MinLength } from 'class-validator';

export class UpdateGlassesDeliveryDto {
  @ApiProperty({ example: '2026-05-08', description: 'YYYY-MM-DD' })
  @IsDateString()
  data_entrega_oculos: string;

  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @MinLength(2)
  responsavel_entrega_oculos: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  entrega_oculos_confirmada: boolean;
}
