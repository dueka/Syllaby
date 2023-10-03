// pages/api/login.ts
import { NextResponse } from "next/server";
import { verifyPassword } from "../../../utils/auth";
import { readData } from "../../db/db";

export async function POST(req: any, res: NextResponse) {
  try {
    const { username, password } = await req.json();
    const db = await readData();
    const user = db.users.find((user: any) => user.username === username);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const passwordMatch = await verifyPassword(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "Login successful",
      user: { ...user, password: undefined },
    });
  } catch {
    return NextResponse.error();
  }
}
