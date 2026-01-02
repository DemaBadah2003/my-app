// app/api/register/route.ts
import { NextResponse } from "next/server";
import { registerUser } from "@/app/helpers/registerService";
import { ValidationError } from "yup";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await registerUser(body);

    // ترجع البيانات إذا كل شيء صحيح
    return NextResponse.json(result, { status: 200 });

  } catch (err: any) {
    console.log("🔥 REGISTER ERROR:", err);

    // لو كان الخطأ من التحقق (Yup ValidationError)
    if (err instanceof ValidationError || err.name === "ValidationError") {
      // نجهز قائمة لكل حقل بالرسالة والقيمة ونوع الخطأ
      const formattedErrors = err.inner?.map((e: any) => ({
        field: e.path || null,   // اسم الحقل
        message: e.message,       // رسالة الخطأ
        value: e.value,           // القيمة اللي أرسلها المستخدم
        type: e.type || "validation_error", // نوع الخطأ (مثلاً "required", "email", إلخ)
      })) || [];

      return NextResponse.json(
        { errors: formattedErrors },
        { status: 422 }
      );
    }

    // أي خطأ آخر
    return NextResponse.json(
      { error: "طلب غير صالح" },
      { status: 400 }
    );
  }
}
