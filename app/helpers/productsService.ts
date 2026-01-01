import prisma from "@/src/lib/prisma";
import * as yup from "yup";

// التحقق من البيانات Schema
export const productSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  category: yup.string().required("Category is required"),
  owner: yup.string().required("Owner is required"),
  count: yup.number().required("Count is required").positive().integer(),
});

export async function createProduct(data: any) {
  // التحقق من صحة البيانات
  const validatedData = await productSchema.validate(data, {
    abortEarly: false, // تظهر كل الأخطاء مرة واحدة
  });

  try {
    // إنشاء منتج جديد في قاعدة البيانات
    const newProduct = await prisma.products.create({ // ✅ lowercase 'product'
      data: {
        name: validatedData.name,
        category: validatedData.category,
        owner: validatedData.owner,
        count: validatedData.count,
      },
    });

    return {
      status: 201,
      json: {
        message: "Product created successfully",
        data: newProduct,
      },
    };
  } catch (err: any) {
    if (err.code === "P2002") {
      return {
        status: 409,
        json: { error: "Product already exists" },
      };
    }

    return {
      status: 500,
      json: { error: err.message || "Server Error" },
    };
  }
}
