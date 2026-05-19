import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() username: string;
  @ApiProperty({ enum: Role }) role: Role;
  @ApiProperty() active: boolean;
  @ApiProperty() createdAt: Date;
  @ApiProperty({ type: [Number] }) schoolIds: number[];
}

