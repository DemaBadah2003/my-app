import { NextResponse } from "next/server";
import fs from "fs";
import { ensureFileExists, checkDuplicates, userSchema, filePath, addUser} from "@/app/helpers/fileHelper"; // تصحيح الاستدعاء

export async function POST(req: Request) {
  try {
    ensureFileExists(); // التأكد من وجود الملف والمجلد

    const body = await req.json();

    // -------------------- ADD باستخدام الدالة المشتركة --------------------
const result = await addUser(body);
return NextResponse.json(result.json, { status: result.status });

  } catch (err: any) {
    if (err.name === "ValidationError") {
      return NextResponse.json({ error: err.errors }, { status: 422 });
    } else {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }
}