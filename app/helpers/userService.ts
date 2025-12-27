import { PrismaClient } from "@prisma/client";
import { userSchema } from "./schema";

const prisma = new PrismaClient();

// 1️⃣ قراءة جميع المستخدمين
export async function readUsers() {
  return prisma.member.findMany();
}

// 2️⃣ إضافة مستخدم
export async function addUser(data: any) {
  const validatedData = await userSchema.validate(data, { abortEarly: false });

  try {
    const newUser = await prisma.member.create({
      data: {
        FullName: validatedData.name,
        Email: validatedData.email,
      },
    });

    return {
      status: 201,
      json: { message: "User added successfully", user: newUser },
    };

  } catch (err: any) {
    if (err.code === "P2002") { // unique constraint
      return {
        status: 409,
        json: { error: "User already exists" },
      };
    }

    return { status: 500, json: { error: err.message || "Server Error" } };
  }
}

// 3️⃣ حذف مستخدم
export async function deleteUser(email: string) {
  await prisma.member.deleteMany({ where: { Email: email } });
  return { success: true, message: "User deleted successfully" };
}

// 4️⃣ حذف جميع المستخدمين
export async function deleteAllUsers() {
  await prisma.member.deleteMany({});
  return { success: true, message: "All users deleted successfully" };
}
