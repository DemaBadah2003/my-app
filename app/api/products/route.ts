import { NextResponse } from "next/server";
import {
  readProducts,
  deleteProduct,
  deleteAllProducts,
  createProduct
} from "@/app/helpers/productsService";

export async function GET() {
  try {
    const products = await readProducts();
    return NextResponse.json({ products }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    switch (body.action) {
      // ✅ حذف منتج واحد
      case "delete":
        return NextResponse.json(
          await deleteProduct(Number(body.productid))
        );

      // حذف كل المنتجات
      case "deleteAll":
  return NextResponse.json(await deleteAllProducts());


      // إضافة منتج
      case "add":
        const { name, owner, category, count } = body.data;
        const product = await createProduct(name, owner, category, count);
        return NextResponse.json({
          success: true,
          product,
          message: "Product added successfully",
        });

      default:
        return NextResponse.json(
          { success: false, message: "Action not allowed" },
          { status: 403 }
        );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
