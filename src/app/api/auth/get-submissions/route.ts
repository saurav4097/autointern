import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Submission from "@/models/Submission";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  await connectDB();
const { searchParams } = new URL(req.url);
  const role = searchParams.get("role"); // ✅ get role from query

  const token = (await cookies()).get("token")?.value;
  const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!);

  const submissions = await Submission.find({
    email: decoded.email,
    role: role, 
  });

  return NextResponse.json({ submissions });
}