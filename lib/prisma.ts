import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` in development to preserve the client across HMR
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

const prisma = global.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.__prisma = prisma;

export default prisma;
