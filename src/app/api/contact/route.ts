import { NextResponse } from "next/server";
import Query from "@/models/Query";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse request body
    const { name, email, message } = await req.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Save query in MongoDB
    const newQuery = new Query({
      name,
      email,
      message,
    });

    await newQuery.save();

    return NextResponse.json(
      { success: true, message: "Query saved successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error saving query:", error);

    return NextResponse.json(
      { error: "Failed to save query" },
      { status: 500 }
    );
  }
}