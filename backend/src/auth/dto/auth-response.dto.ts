import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

class UserSummaryDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty() username: string;
  @ApiProperty({ enum: Role }) role: Role;
  @ApiProperty({ type: [Number] }) schoolIds: number[];
}

export class AuthResponseDto {
  @ApiProperty() access_token: string;
  @ApiProperty({ type: UserSummaryDto }) user: UserSummaryDto;
}

