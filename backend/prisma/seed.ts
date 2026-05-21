import 'dotenv/config';
// allow `require` in this script without depending on @types/node
declare function require(name: string): any;
import { PrismaClient } from '@prisma/client';
// Use `require` for bcrypt to avoid type declaration issues during build
// (some environments may not install dev @types packages). We'll treat it as any.
const bcrypt: any = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.users.count();

  if (userCount > 0) {
    console.log(`Banco já possui ${userCount} usuário(s). Seed ignorado.`);
    return;
  }

  const env = (globalThis as any).process?.env ?? {};
  const passwordAdmin: string = env.PASSWORD_ADMIN ?? 'admin@123';
  const hashedPassword = await bcrypt.hash(passwordAdmin, 10);

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
    // use globalThis to avoid TypeScript errors when `process` types are not available
    try {
      (globalThis as any).process.exit(1);
    } catch {
      // nothing else to do
    }
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
