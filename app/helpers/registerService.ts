import prisma from "@/src/lib/prisma";
import { registerSchema } from "@/app/helpers/schema";

export async function registerUser(data: any) {
  // التحقق من صحة البيانات
  const validatedData = await registerSchema.validate(data, {
    abortEarly: false,
  });

  try {
    // إنشاء مستخدم جديد في جدول User
 const newUser = await prisma.user.create({
  data: {
    name: validatedData.name,
    email: validatedData.email,
    phone: validatedData.phone,
    category: validatedData.category || "Student",
  },
});



    return {
      status: 201,
      json: {
        message: "Registered successfully",
        data: newUser,
      },
    };
  } catch (err: any) {
    if (err.code === "P2002") {
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
