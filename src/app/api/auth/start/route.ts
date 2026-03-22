import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Internship from "@/models/Internship";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectDB();

  const { role } = await req.json();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  const user = await User.findById(decoded.id);

  const startDate = new Date();

  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 30);

  await Internship.create({
    name: user.name,
    email: user.email,
    role,
    startDate,
    endDate,
  });

  return NextResponse.json({ success: true });
}