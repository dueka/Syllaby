// pages/api/register.ts
import { NextResponse } from "next/server";
import { createUser } from "../../db/db";

export async function POST(req: any, res: NextResponse) {
  try {
    const { username, password, role } = await req.json();
    const result = await createUser({ username, password, role });
    if (result.success) {
      return NextResponse.json({ message: `User registered successfully!` });
    } else {
      return NextResponse.json({ message: `Error creating user!` });
    }
  } catch {
    return NextResponse.error();
  }
}
