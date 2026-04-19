import { PrismaClient } from '@prisma/client';

// Singleton para o banco de dados
const prisma = new PrismaClient();

export default prisma;
