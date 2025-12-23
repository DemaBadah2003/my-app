// استدعاء PrismaClient للتعامل مع قاعدة البيانات
import { PrismaClient } from "@prisma/client";

// متغير عالمي لتخزين Prisma Client مرة واحدة فقط
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// إذا كان Prisma Client موجود مسبقًا استخدمه، وإلا أنشئ واحد جديد
// log: ["error", "warn"] يظهر الأخطاء والتحذيرات في الـ console
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

// في التطوير نخزن Prisma Client في المتغير العالمي لتجنب الإنشاء المتكرر
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// تصدير Prisma Client لاستخدامه في أي مكان بالمشروع
export default prisma;