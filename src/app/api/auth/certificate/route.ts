import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";
import Internship from "@/models/Internship";

// PDF LIB
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET() {
  await connectDB();

  const token = (await cookies()).get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

  const user = await User.findById(decoded.id);
  const intern = await Internship.findOne({ email: user.email });

  // 📄 Create PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([800, 600]);

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();

  // Title
  page.drawText("Certificate of Completion", {
    x: 180,
    y: 500,
    size: 30,
    font,
    color: rgb(0, 0.5, 0),
  });

  // Name
  page.drawText(`${user.name}`, {
    x: 250,
    y: 420,
    size: 24,
    font,
  });

  // Description
  page.drawText(
    `has successfully completed the ${intern.role} Internship`,
    {
      x: 120,
      y: 380,
      size: 16,
    }
  );

  page.drawText("at AutoIntern", {
    x: 300,
    y: 350,
    size: 16,
  });

  page.drawText(
    `Duration: ${new Date(intern.startDate).toDateString()} - ${new Date(
      intern.endDate
    ).toDateString()}`,
    {
      x: 150,
      y: 300,
      size: 12,
    }
  );

  // Footer
  page.drawText("AutoIntern Team", {
    x: 320,
    y: 100,
    size: 14,
  });

 
const pdfBytes = await pdfDoc.save();
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=certificate.pdf",
    },
  });
}