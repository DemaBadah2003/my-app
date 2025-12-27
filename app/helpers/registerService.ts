import { PrismaClient } from "@prisma/client";
import { registerSchema } from "./schema";

const prisma = new PrismaClient();

export async function registerUser(data: any) {
  // 1️⃣ التحقق من صحة البيانات
  const validatedData = await registerSchema.validate(data, { abortEarly: false });

  try {
    // 2️⃣ إضافة المستخدم في قاعدة البيانات
    const newMember = await prisma.member.create({
      data: {
        FullName: validatedData.name,
        Email: validatedData.email,
      },
    });

    return {
      status: 201,
      json: { message: "Registered successfully", data: newMember },
    };

  } catch (err: any) {
    // 3️⃣ التعامل مع التكرار
    if (err.code === "P2002") { // unique constraint violation
      return {
        status: 409,
        json: { error: "Email already registered" },
      };
    }

    return {
      status: 500,
      json: { error: err.message || "Server Error" },
    };
  }
}
