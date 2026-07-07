import { NextRequest, NextResponse } from "next/server";
import razorpay from "@/lib/razorpay";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Internship from "@/models/Internship";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

const cookieStore = await cookies();
const token = cookieStore.get("token")?.value;

if (!token) {
  return NextResponse.json(
    {
      success: false,
      message: "Please login first.",
    },
    {
      status: 401,
    }
  );
}

const decoded: any = jwt.verify(
  token,
  process.env.JWT_SECRET!
);

const user = await User.findById(decoded.id);

if (!user) {
  return NextResponse.json(
    {
      success: false,
      message: "User not found.",
    },
    {
      status: 404,
    }
  );
}
    const { role } = await req.json();

    if (!role) {
      return NextResponse.json(
        { success: false, message: "Role is required." },
        { status: 400 }
      );
    }

    const options = {
      amount: 799 * 100, // ₹799 -> paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        role,
      },
    }; 

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create payment order.",
      },
      { status: 500 }
    );
  }
}