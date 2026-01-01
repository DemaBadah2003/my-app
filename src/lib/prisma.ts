
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
        log: ["query"], // optional: يظهر جميع الاستعلامات في التيرمينال

  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;