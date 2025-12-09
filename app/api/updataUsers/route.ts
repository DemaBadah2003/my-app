import { NextResponse } from "next/server";
import { ensureFileExists, userSchema } from "@/app/helpers/fileHelper"; // استدعاء userSchema
import fs from "fs";
import path from "path";

// مسار المجلد والملف
const dirPath = path.join(process.cwd(), "app/api/data");
const filePath = path.join(dirPath, "users.json");

// -------------------- Types --------------------
export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
};

// -------------------- Check duplicates --------------------
function checkDuplicates(users: User[], email: string, phone: string, excludeId?: number): string | null {
  const emailExists = users.some(u => u.email === email && u.id !== excludeId);
  const phoneExists = users.some(u => u.phone === phone && u.id !== excludeId);

  if (emailExists && phoneExists) return "Email and phone already exist";
  if (emailExists) return "Email already exists";
  if (phoneExists) return "Phone already exists";
  return null;
}

// -------------------- PATCH for UPDATE --------------------
export async function PATCH(req: Request) {
  try {
    // استلام البيانات الأصلية فقط
    const userPayload: User = await req.json(); // {id, name, email, phone, category}

    // تأكد أن الملف موجود
    ensureFileExists();
    const users: User[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const index = users.findIndex(u => u.id === userPayload.id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // تحقق من صحة البيانات باستخدام Yup schema
    try {
      await userSchema.validate(userPayload);
    } catch (err: any) {
      return NextResponse.json(
        { success: false, message: err.errors },
        { status: 422 }
      );
    }

    // تحقق من التكرار مع استثناء المستخدم نفسه
    const duplicateMessage = checkDuplicates(users, userPayload.email, userPayload.phone, userPayload.id);
    if (duplicateMessage) {
      return NextResponse.json(
        { success: false, message: duplicateMessage },
        { status: 409 }
      );
    }

    // تحديث المستخدم
    users[index] = userPayload;
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json(
      { success: true, message: "User updated successfully", user: userPayload },
      { status: 200 }
    );

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
