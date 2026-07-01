import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import Internship from "@/models/Internship";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      role,
    } = await req.json();

    // Check required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !role
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing payment details",
        },
        { status: 400 }
      );
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed",
        },
        { status: 400 }
      );
    }

    // Get logged in user
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
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
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Prevent duplicate purchase
    const existing = await Internship.findOne({
      email: user.email,
      role,
      isSubscribed: true,
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyPurchased: true,
      });
    }

    const startDate = new Date();

    const endDate = new Date();

    endDate.setDate(startDate.getDate() + 30);

    await Internship.create({
      name: user.name,
      email: user.email,

      role,

      amount: 999,

      isSubscribed: true,

      razorpayOrderId: razorpay_order_id,

      razorpayPaymentId: razorpay_payment_id,

      startDate,

      endDate,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Verification failed",
      },
      {
        status: 500,
      }
    );
  }
}