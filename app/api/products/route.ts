import { NextResponse } from "next/server";
import {readProducts,deleteProducts,deleteAllProducts,} from "@/app/helpers/productsService";

export async function GET() {
  console.log("GET /api/products");

  try {
    const products = await readProducts();
    return NextResponse.json({ products }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "delete") {
      return NextResponse.json(
        await deleteProducts(body.data.id)
      );
    }

    if (body.action === "deleteAll") {
      return NextResponse.json(
        await deleteAllProducts()
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Adding products is only allowed via register",
      },
      { status: 403 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
