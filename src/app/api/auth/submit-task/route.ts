import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Submission from "@/models/Submission";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await connectDB();

  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  // ✅ IMPORTANT: use formData instead of json
  const formData = await req.formData();

  const role = formData.get("role") as string;
  const task = formData.get("task") as string;
  const text = formData.get("text") as string;

  const file1 = formData.get("file1") as File | null;
  const file2 = formData.get("file2") as File | null;

  // 🚫 Prevent duplicate submission (per project)
  const existing = await Submission.findOne({
    email: decoded.email,
    role,
    task,
  });

  if (existing) {
    return NextResponse.json({ message: "Already submitted" });
  }

  // ⚠️ For now we store file names (later upgrade to Cloudinary)
  const file1Name = file1 ? file1.name : null;
  const file2Name = file2 ? file2.name : null;

  await Submission.create({
    email: decoded.email,
    role,
    task,
    text,
    file1: file1Name,
    file2: file2Name,
  });

  return NextResponse.json({ success: true });
}