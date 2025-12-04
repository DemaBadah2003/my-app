import { NextResponse } from "next/server";
import * as yup from "yup";
import fs from "fs";
import path from "path";

// مسار المجلد والملف
const dirPath = path.join(process.cwd(), "app/api/data");
const filePath = path.join(dirPath, "users.json");

// إنشاء الملف والمجلد إذا غير موجود
function ensureFileExists() {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}

// مخطط التحقق باستخدام Yup
const schema = yup.object().shape({
  name: yup.string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  email: yup.string()
    .required("Email is required")
    .email("Email must be valid")
    .matches(/@/, "Email must contain '@'")
    .matches(/gmail\.com$/, "Email must end with gmail.com"),
  phone: yup.string()
    .required("Phone is required")
    .matches(/^\d+$/, "Phone must contain only numbers")
    .matches(/^05(6|9)\d{7}$/, "Phone must start with 056 or 059 and be 10 digits"),
  category: yup.string()
    .required("Category is required"),
});

export async function POST(req: Request) {
  try {
    ensureFileExists();

    const body = await req.json();

    // التحقق من صحة البيانات
    await schema.validate(body);

    const data = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(data);

    // تحقق من تكرار البريد أو الهاتف
    const exists = users.some((u: any) => u.email === body.email || u.phone === body.phone);
    if (exists) {
      return NextResponse.json({ message: "The data already exist" }, { status: 409 });
    }

    const newUser = { id: Date.now(), ...body };
    users.push(newUser);

    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: "User registered successfully!", user: newUser }, { status: 201 });

  }
  catch (err: any) {
    if (err instanceof yup.ValidationError) {
      return NextResponse.json(
        { error: err.errors },
        { status: 422 }
      );
    }
    else {
      console.log(err.errors)
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }
}
