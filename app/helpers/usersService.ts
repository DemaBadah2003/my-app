import prisma from "@/src/lib/prisma"; // استيراد Prisma Client الموحد

// ==============================
// قراءة جميع المستخدمين
// ==============================
export async function readUsers() {
  return prisma.user.findMany();
}

// ==============================
// إنشاء مستخدم جديد
// ==============================
export async function createUser(
  name: string,
  email?: string,
  phone?: string,
  category: string = "Student"
) {
  return prisma.user.create({
    data: {
      name,
      email,
      phone,
      category,
    },
  });
}

// ==============================
// حذف مستخدم حسب البريد الإلكتروني
// ==============================
export async function deleteUser(email: string) {
  const deleted = await prisma.user.deleteMany({
    where: { email },
  });

  if (deleted.count === 0) {
    return { success: false, message: "No user found with this email" };
  }

  return { success: true, message: "User deleted successfully" };
}

// ==============================
// حذف جميع المستخدمين
// ==============================
export async function deleteAllUsers() {
  await prisma.user.deleteMany({});
  return { success: true, message: "All users deleted successfully" };
}
