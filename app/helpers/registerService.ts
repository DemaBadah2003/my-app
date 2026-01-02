import prisma from "@/src/lib/prisma";
import { fullRegisterSchema } from "@/app/helpers/schema";

export async function registerUser(data: any) {
  // ✅ Validation
  const validatedData = await fullRegisterSchema.validate(data, {
    abortEarly: false,
  });

  try {
    const newUser = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        category: validatedData.category,
      },
    });

    // إرجاع الكائن مباشرة بدون json:
    return {
      message: "تم التسجيل بنجاح",
      data: newUser,
    };
  } catch (err: any) {
    if (err.code === "P2002") {
      return {
        error: "هذا الإيميل مسجّل مسبقًا",
      };
    }

    return {
      error: "خطأ في السيرفر",
    };
  }
}
