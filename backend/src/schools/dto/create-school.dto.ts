import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateSchoolDto {
  @ApiProperty({ example: 'Escola Municipal João Paulo II' })
  @IsString()
  @MinLength(3)
  name: string;
}
