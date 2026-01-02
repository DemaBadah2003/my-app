// /api/updataUsers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma"; // تأكد من مسار Prisma Client
import * as yup from "yup";

// -------------------- Yup schema للتحقق من الشروط --------------------
const userSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .trim()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/, "Email must be valid and end with .com")
    .required("Email is required"),
  phone: yup
    .string()
    .trim()
    .matches(/^05(6|9)\d{7}$/, "Phone must start with 056 or 059 followed by 7 digits")
    .required("Phone is required"),
  category: yup
    .string()
    .oneOf(["student", "teacher", "developer"], "Category must be selected")
    .required("Category is required")
});

// -------------------- PATCH --------------------
export async function PATCH(req: Request) {
  try {
    const payload = await req.json();
    const { userId, name, email, phone, category } = payload;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID" },
        { status: 400 }
      );
    }

    // تحقق من صحة البيانات قبل أي تحديث
    try {
      await userSchema.validate({ name, email, phone, category }, { abortEarly: false });
    } catch (err: any) {
      // جمع كل الأخطاء وعرضها
      const errors = err.inner?.map((e: any) => e.message) || [err.message];
      return NextResponse.json({ success: false, message: errors.join(", ") }, { status: 422 });
    }

    // تحقق أن المستخدم موجود
    const existingUser = await prisma.user.findUnique({
      where: { userId: Number(userId) }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // تحقق من تكرار البريد أو الهاتف باستثناء هذا المستخدم
    const duplicateUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ],
        NOT: { userId: Number(userId) }
      }
    });

    if (duplicateUser) {
      let msg = "";
      if (duplicateUser.email === email && duplicateUser.phone === phone) msg = "Email and phone already exist";
      else if (duplicateUser.email === email) msg = "Email already exists";
      else msg = "Phone already exists";

      return NextResponse.json({ success: false, message: msg }, { status: 409 });
    }

    // تحديث المستخدم
    const updatedUser = await prisma.user.update({
      where: { userId: Number(userId) },
      data: { name, email, phone, category }
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update user" },
      { status: 500 }
    );
  }
}
