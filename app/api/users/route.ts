import { NextResponse } from "next/server";
import { readData } from "../../db/db";

export async function GET(req: any, res: NextResponse) {
  try {
    const db = await readData();
    const users = db.users.map((user: any) => ({
      id: user.id,
      username: user.username,
      role: user.role,
    }));
    return NextResponse.json({
      message: "User retrieval successful",
      users: { ...users },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "User retrieval failed" },
      { status: 404 }
    );
  }
}
