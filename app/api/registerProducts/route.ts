import { NextResponse } from "next/server";
import { registerProducts } from "@/app/helpers/registerProductsService";
import { ValidationError } from "yup";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await registerProducts(body);
    return NextResponse.json(result, { status: 200 });

  } catch (err: any) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { errors: err.errors },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
