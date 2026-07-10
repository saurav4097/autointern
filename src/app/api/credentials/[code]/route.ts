import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Interndata from "@/models/Interndata";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectDB();
console.log("Collection:", Interndata.collection.name);
    const { code } = await params;
console.log("Received Code:", code);
// Show ALL documents in this collection
const all = await Interndata.find();

console.log("All Documents:", all);
    const credential = await Interndata.findOne({
      credentialId: code,
    });
console.log("Mongo Result:", credential);
    if (!credential) {
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 404 }
      );
    }


    return NextResponse.json({
      name: credential.name,
      details: credential.details,
      role: credential.role,
      credentialType: credential.credentialType,
      credentialId: credential.credentialId,
      duration: credential.duration,
      startDate: credential.startDate,
      endDate: credential.endDate,
      issueDate: credential.issueDate,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}