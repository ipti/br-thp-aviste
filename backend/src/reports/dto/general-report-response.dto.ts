import { ApiProperty } from '@nestjs/swagger';

export class SchoolReportDto {
  @ApiProperty() schoolId: number;
  @ApiProperty() school: string;
  @ApiProperty() countClassroom: number;
  @ApiProperty() countRegister: number;
  @ApiProperty() countQuestianarioPais: number;
  @ApiProperty() countRegisterTriados: number;
  @ApiProperty() countForwardedConsultation: number;
  @ApiProperty() countConsultationCompleted: number;
  @ApiProperty() countReceitaOculosCompleted: number;
  @ApiProperty() countEntregaOculosCompleted: number;
}
