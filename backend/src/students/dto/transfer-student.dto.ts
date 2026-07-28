import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class TransferStudentDto {
  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  classroom_fk: number;
}
