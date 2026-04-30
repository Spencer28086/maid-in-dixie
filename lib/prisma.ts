let prisma: any;

if (process.env.NODE_ENV !== "production") {
  if (!(global as any).prisma) {
    const { PrismaClient } = require("@prisma/client");
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
} else {
  const { PrismaClient } = require("@prisma/client");
  prisma = new PrismaClient();
}

export { prisma };