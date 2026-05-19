import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

const USER_SELECT = {
  id: true,
  name: true,
  username: true,
  role: true,
  active: true,
  createdAt: true,
  userSchools: {
    select: { school_fk: true },
  },
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private toResponse(user: {
    id: number;
    name: string;
    username: string;
    role: Role;
    active: boolean;
    createdAt: Date;
    userSchools: Array<{ school_fk: number }>;
  }): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt,
      schoolIds: user.userSchools.map((item) => item.school_fk),
    };
  }

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await this.prisma.users.findFirst({ where: { username: dto.username } });
    if (exists) throw new ConflictException('Username já cadastrado');

    const hashed = await bcrypt.hash(dto.password, 10);
    const created = await this.prisma.users.create({
      data: { ...dto, password: hashed },
      select: USER_SELECT,
    });

    return this.toResponse(created);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.prisma.users.findMany({ select: USER_SELECT, orderBy: { name: 'asc' } });
    return users.map((user) => this.toResponse(user));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({ where: { id }, select: USER_SELECT });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.toResponse(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    await this.findOne(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.password) data['password'] = await bcrypt.hash(dto.password, 10);

    const updated = await this.prisma.users.update({ where: { id }, data, select: USER_SELECT });
    return this.toResponse(updated);
  }

  async addSchool(userId: number, schoolId: number): Promise<UserResponseDto> {
    const [user, school] = await Promise.all([
      this.prisma.users.findUnique({ where: { id: userId }, select: { id: true, role: true } }),
      this.prisma.school.findUnique({ where: { id: schoolId }, select: { id: true } }),
    ]);

    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (!school) throw new NotFoundException('Escola não encontrada');
    if (user.role === Role.ADMIN) {
      throw new BadRequestException('Usuário ADMIN não precisa de vínculo com escola');
    }

    await this.prisma.user_school.upsert({
      where: { user_fk_school_fk: { user_fk: userId, school_fk: schoolId } },
      update: {},
      create: { user_fk: userId, school_fk: schoolId },
    });

    return this.findOne(userId);
  }

  async removeSchool(userId: number, schoolId: number): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    await this.prisma.user_school.deleteMany({ where: { user_fk: userId, school_fk: schoolId } });
    return this.findOne(userId);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.users.delete({ where: { id } });
  }
}
