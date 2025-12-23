import fs from "fs";
import { NextResponse } from "next/server";
import { User } from "../updataUsers/route";
import { ensureFileExists, checkDuplicates, userSchema, filePath, addUser } from "@/app/helpers/fileHelper"; // استدعاء الملف المشترك
import * as yup from "yup";

export async function GET() {
  try {
    ensureFileExists();
    const users: User[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return NextResponse.json({ users }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    ensureFileExists();
    const body: { action: "add" | "delete" | "deleteAll"; data: any } = await req.json();
    const { action, data } = body;

    let users: User[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // -------------------- ADD --------------------
    if (action === "add") {
      const result = await addUser(data); // استدعاء دالة الإضافة من الملف المشترك
      return NextResponse.json(result.json, { status: result.status });
    }

    // -------------------- DELETE --------------------
    if (action === "delete") {
      users = users.filter(u => u.email !== data.email);
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
      return NextResponse.json({ success: true, message: "User deleted successfully" });
    }

    // -------------------- DELETE ALL --------------------
    if (action === "deleteAll") {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return NextResponse.json({ success: true, message: "All users deleted successfully" });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}