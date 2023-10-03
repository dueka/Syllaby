// pages/api/register.js
import { NextResponse } from "next/server";
import { createUser } from "../../db/db"; // Implement a function to save user data to your database

export async function POST(req: any, res: NextResponse) {
  try {
    const { username, password } = await req.json();
    const result = await createUser({ username, password });
    if (result.success) {
      return NextResponse.json({ message: `User submitted successfully!` });
    } else {
      return NextResponse.json({ message: `Error creating user!` }); // Return a 400 Bad Request status with an error message
    }
  } catch {
    return NextResponse.error();
  }
}
