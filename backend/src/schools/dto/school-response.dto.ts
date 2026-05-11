import { ApiProperty } from '@nestjs/swagger';

export class SchoolResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() createdAt: Date;
}
