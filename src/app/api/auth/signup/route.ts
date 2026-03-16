import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
  await connectDB();

  const { name, email } = await req.json();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const user = await User.create({ name, email });

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" }
  );

  const response = NextResponse.json({ message: "Signup success" });

  response.cookies.set("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
} catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
