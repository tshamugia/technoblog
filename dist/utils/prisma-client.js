// Use dynamic import for Prisma in ESM context
import { PrismaClient } from '@prisma/client';
// Use a single instance of Prisma Client in development
const globalForPrisma = global;
export const prisma = globalForPrisma.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : [],
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
