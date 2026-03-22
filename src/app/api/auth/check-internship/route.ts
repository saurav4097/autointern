import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Internship from "@/models/Internship";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ enrolled: false });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  const url = new URL(req.url);
  const role = url.searchParams.get("role");

  const internship = await Internship.findOne({
    email: decoded.email,
    role,
    endDate: { $gt: new Date() },
  });

  if (!internship) {
    return NextResponse.json({ enrolled: false });
  }

  return NextResponse.json({ enrolled: true });
}