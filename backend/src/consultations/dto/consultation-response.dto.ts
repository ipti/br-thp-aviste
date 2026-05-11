import { ApiProperty } from '@nestjs/swagger';

export class ConsultationItemDto {
  @ApiProperty() schoolId: number;
  @ApiProperty() school: string;
  @ApiProperty() classroomId: number;
  @ApiProperty() classroom: string;
  @ApiProperty() studentDataId: number;
  @ApiProperty() studentName: string;
  @ApiProperty() birthday: string;
  @ApiProperty() points: number;
  @ApiProperty() priority: string;
}
