// /api/updataProducts/route.ts
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma"; // تأكد من مسار Prisma Client
import * as yup from "yup";

// -------------------- Yup schema للتحقق من الشروط --------------------
const productSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  owner: yup
    .string()
    .trim()
    .min(2, "Owner must be at least 2 characters")
    .required("Owner is required"),
  count: yup
    .number()
    .min(0, "Count must be 0 or greater")
    .required("Count is required"),
  category: yup
    .string()
    .oneOf(["clothes", "food", "health"], "Category must be selected")
    .required("Category is required")
});

// -------------------- PATCH --------------------
export async function PATCH(req: Request) {
  try {
    const payload = await req.json();
    const {productid, name, owner, count, category } = payload;

    if (!productid) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // تحقق من صحة البيانات قبل أي تحديث
    try {
      await productSchema.validate({ name, owner, count, category }, { abortEarly: false });
    } catch (err: any) {
      const errors = err.inner?.map((e: any) => e.message) || [err.message];
      return NextResponse.json({ success: false, message: errors.join(", ") }, { status: 422 });
    }

    // تحقق أن المنتج موجود
    const existingProduct = await prisma.products.findUnique({
      where: {   productid: Number(productid) }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // تحقق من تكرار الاسم والمالك باستثناء هذا المنتج (اختياري)
    const duplicateProduct = await prisma.products.findFirst({
      where: {
        OR: [
          { name, owner }
        ],
        NOT: {   productid: Number(productid) }
      }
    });

    if (duplicateProduct) {
      return NextResponse.json({ success: false, message: "A product with the same name and owner already exists" }, { status: 409 });
    }

    // تحديث المنتج
    const updatedProduct = await prisma.products.update({
      where: {   productid: Number(productid) },
      data: { name, owner, count, category }
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update product" },
      { status: 500 }
    );
  }
}
