import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

const SELECT = {
  id: true, name: true, username: true, role: true, active: true, createdAt: true,
  password: false, updatedAt: false,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await this.prisma.users.findFirst({ where: { username: dto.username } });
    if (exists) throw new ConflictException('Username já cadastrado');

    const hashed = await bcrypt.hash(dto.password, 10);
    return this.prisma.users.create({ data: { ...dto, password: hashed }, select: SELECT });
  }

  findAll(): Promise<UserResponseDto[]> {
    return this.prisma.users.findMany({ select: SELECT, orderBy: { name: 'asc' } });
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.users.findUnique({ where: { id }, select: SELECT });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserResponseDto> {
    await this.findOne(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.password) data['password'] = await bcrypt.hash(dto.password, 10);
    return this.prisma.users.update({ where: { id }, data, select: SELECT });
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.prisma.users.delete({ where: { id } });
  }
}
