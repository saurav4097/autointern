import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Internship from "@/models/Internship";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  const internship = await Internship.findOne({
    email: decoded.email,
  });

  return NextResponse.json({ internship });
}