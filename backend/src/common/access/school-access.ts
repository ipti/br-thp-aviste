import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface RequestUser {
  id: number;
  role: Role;
}

export async function getAllowedSchoolIds(
  prisma: PrismaService,
  user: RequestUser,
): Promise<number[] | null> {
  if (user.role === Role.ADMIN) return null;

  const relations = await prisma.user_school.findMany({
    where: { user_fk: user.id },
    select: { school_fk: true },
  });

  return relations.map((item) => item.school_fk);
}
