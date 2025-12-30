import { NextResponse } from "next/server";
import { registerUser } from "@/app/helpers/registerService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await registerUser(body);

    return NextResponse.json(result.json, { status: result.status });

  } catch (err: any) {
    if (err.name === "ValidationError") {
      return NextResponse.json({ errors: err.errors }, { status: 422 });
    }

    return NextResponse.json({ error: err.message || "Bad Request" }, { status: 400 });
  }
}
