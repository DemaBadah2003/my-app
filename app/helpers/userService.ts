import { PrismaClient } from "@prisma/client";
import { userSchema } from "./schema";

const prisma = new PrismaClient();

// 1️⃣ قراءة جميع المستخدمين
export async function readUsers() {
  return prisma.members.findMany();
}

// 2️⃣ إضافة مستخدم
export async function addUser(data: any) {
  const validatedData = await userSchema.validate(data, { abortEarly: false });

  try {
    const newUser = await prisma.members.create({
      data: {
        fullname: validatedData.name,
        email: validatedData.email,
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
  await prisma.members.deleteMany({ where: { email: email } });
  return { success: true, message: "User deleted successfully" };
}

// 4️⃣ حذف جميع المستخدمين
export async function deleteAllUsers() {
  await prisma.members.deleteMany({});
  return { success: true, message: "All users deleted successfully" };
}
