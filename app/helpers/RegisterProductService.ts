import prisma from "@/src/lib/prisma";
import { fullRegisterSchema, FullRegister } from "@/app/helpers/schema";

export async function registerUser(data: any) {
  // تحقق من صحة البيانات
  const validatedData: FullRegister = await fullRegisterSchema.validate(data, {
    abortEarly: false,
  });

  try {
    // إنشاء سجل جديد في جدول products
    const newRecord = await prisma.products.create({
      data: {
        name: validatedData.productName,  // اسم المنتج
        category: validatedData.category, // تصنيف المنتج
        owner: validatedData.owner,
        count: validatedData.count,
      },
    });

    return {
      status: 201,
      json: {
        message: "Created successfully",
        data: newRecord,
      },
    };
  } catch (err: any) {
    if (err.code === "P2002") {
      return {
        status: 409,
        json: { error: "Duplicate value" },
      };
    }

    return {
      status: 500,
      json: { error: err.message || "Server Error" },
    };
  }
}
