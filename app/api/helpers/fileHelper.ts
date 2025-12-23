import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import * as yup from "yup";

export const dirPath = path.join(process.cwd(), "app/api/data");
export const filePath = path.join(dirPath, "users.json");

// -------------------- تأكد من وجود الملف --------------------
export function ensureFileExists() {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}

// -------------------- مخطط التحقق باستخدام Yup --------------------
export const userSchema = yup.object().shape({
  name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters"),
  email: yup.string().required("Email is required").email("Email must be valid"),
  phone: yup.string()
    .required("Phone is required")
    .matches(/^\d+$/, "Phone must contain only numbers"),
  category: yup.string().required("Category is required"),
});

// -------------------- التحقق من التكرار --------------------
export function checkDuplicates(users: any[], email: string, phone: string) {
  const emailExists = users.some(u => u.email === email);
  const phoneExists = users.some(u => u.phone === phone);

  if (emailExists && phoneExists) return "Email and Phone already exist";
  if (emailExists) return "Email already exists";
  if (phoneExists) return "Phone already exists";
  return null;
}

// -------------------- POST Add مستخدم جديد --------------------
export async function addUser(body: any) {
  try {
    ensureFileExists();

    // التحقق من صحة البيانات باستخدام Yup
    await userSchema.validate(body);

    // قراءة البيانات الحالية
    const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // تحقق من التكرار
    const duplicateMessage = checkDuplicates(users, body.email, body.phone);
    if (duplicateMessage) {
      return { status: 409, json: { message: duplicateMessage } };
    }

    // إنشاء مستخدم جديد
    const newUser = { id: Date.now(), ...body };
    users.push(newUser);
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    return { status: 201, json: { message: "User registered successfully!", user: newUser } };
  } catch (err: any) {
    if (err.name === "ValidationError") {
      return { status: 422, json: { error: err.errors } };
    } else {
      return { status: 400, json: { error: err.message } };
    }
  }
}