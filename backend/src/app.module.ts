import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SchoolsModule } from './schools/schools.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { StudentsModule } from './students/students.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { ReportsModule } from './reports/reports.module';
import { MigrationModule } from './migration/migration.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SchoolsModule,
    ClassroomsModule,
    StudentsModule,
    ConsultationsModule,
    ReportsModule,
    MigrationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule { }
