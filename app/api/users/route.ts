import { NextResponse } from "next/server";
import { readUsers, deleteUser, deleteAllUsers } from "@/app/helpers/usersService";

export async function GET() {
    console.log("GET /api/users");

  try {
    const users = await readUsers();
    return NextResponse.json({ users }, { status: 200 });
  } catch (err: any) {
      console.error("Error fetching users:", err); // ← هذا سيظهر سبب الخطأ في التيرمينال

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.action === "delete") {
  return NextResponse.json(await deleteUser(body.data.email));
    }

    if (body.action === "deleteAll") {
      return NextResponse.json(await deleteAllUsers());
    }

    return NextResponse.json(
      { success: false, message: "Adding users is only allowed via register" },
      { status: 403 }
    );

  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }

}