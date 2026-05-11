import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.users.count();

  if (userCount > 0) {
    console.log(`Banco já possui ${userCount} usuário(s). Seed ignorado.`);
    return;
  }

  const hashedPassword = await bcrypt.hash('admin@123', 10);

  const admin = await prisma.users.create({
    data: {
      name: 'Administrador',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      active: true,
    },
  });

  console.log(`Usuário admin criado com sucesso! ID: ${admin.id}`);
  console.log('  username: admin');
  console.log('  password: admin@123');
  console.log('  role: ADMIN');
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
