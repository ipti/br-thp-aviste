import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class SchoolRefDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
}

export class ClassroomResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiPropertyOptional() year?: string | null;
  @ApiProperty() school_fk: number;
  @ApiProperty({ type: SchoolRefDto }) school: SchoolRefDto;
  @ApiProperty() createdAt: Date;
}
