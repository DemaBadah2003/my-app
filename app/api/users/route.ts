import { NextResponse } from "next/server";
import { addUser, readUsers, deleteUser, deleteAllUsers } from "@/app/helpers/userService";

export async function GET() {
  try {
    const users = await readUsers(); // ✅ الحل هنا
    return NextResponse.json({ users }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: { action: "add" | "delete" | "deleteAll"; data: any } = await req.json();
    const { action, data } = body;

    if (action === "add") {
      const result = await addUser(data);
      return NextResponse.json(result.json, { status: result.status });
    }

    if (action === "delete") {
      const result = deleteUser(data.email);
      return NextResponse.json(result);
    }

    if (action === "deleteAll") {
      const result = deleteAllUsers();
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
