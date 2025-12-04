import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dirPath = path.join(process.cwd(), "app/api/data");
const filePath = path.join(dirPath, "users.json");

// تأكد أن الملف والمجلد موجود
function ensureFileExists() {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([], null, 2));
}

export async function GET() {
  try {
    ensureFileExists();
    const data = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(data);
    return NextResponse.json({ users }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    ensureFileExists();
    const body = await req.json();
    const { action, data } = body;

    const fileData = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(fileData);

    if (action === "update") {
      const { oldEmail, newData } = data;
      const index = users.findIndex((u: any) => u.email === oldEmail);
      if (index === -1) return NextResponse.json({ success: false, message: "User not found" });
      users[index] = newData;
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
      return NextResponse.json({ success: true, message: "User updated successfully" });
    }

    if (action === "delete") {
      const { email } = data;
      users = users.filter((u: any) => u.email !== email);
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
      return NextResponse.json({ success: true, message: "User deleted successfully" });
    }

    if (action === "deleteAll") {
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return NextResponse.json({ success: true, message: "All users deleted successfully" });
    }

    return NextResponse.json({ success: false, message: "Unknown action" });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message });
  }
}
