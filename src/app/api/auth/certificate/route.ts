import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";
import Internship from "@/models/Internship";

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function GET() {
  try {
    await connectDB();

    // 🔐 AUTH
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.id);
    const intern = await Internship.findOne({ email: user.email });

    if (!user || !intern) {
      return NextResponse.json({ error: "Data not found" }, { status: 404 });
    }

    // ===============================
    // 📄 CREATE PDF
    // ===============================
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([1200, 850]);

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const { width } = page.getSize();

    // ===============================
    // 🖼️ LOAD CERTIFICATE TEMPLATE
    // ===============================
    const imageBytes = await fetch(
      "http://localhost:3002/certificate.png"
    ).then((res) => res.arrayBuffer());

    const image = await pdfDoc.embedPng(imageBytes);

    // FULL BACKGROUND
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: 1200,
      height: 850,
    });

    // ===============================
    // ✍️ ADD TEXT (PERFECTLY ALIGNED)
    // ===============================

    // 🧑 NAME (CENTERED)
    const name = user.name;
    const nameSize = 42;

    const nameWidth = fontBold.widthOfTextAtSize(name, nameSize);

    page.drawText(name, {
      x: (width - nameWidth) / 2,
      y: 470,
      size: nameSize,
      font: fontBold,
      color: rgb(0, 0.45, 0),
    });

    // 💼 ROLE (CENTERED)
    const roleText = `${intern.role.toUpperCase()} INTERNSHIP`;
    const roleSize = 20;

    const roleWidth = font.widthOfTextAtSize(roleText, roleSize);

    page.drawText(roleText, {
      x: (width - roleWidth) / 2,
      y: 340,
      size: roleSize,
      font: font,
      color: rgb(0.1, 0.1, 0.1),
    });

    // 📅 DATE
    const dateText = new Date().toLocaleDateString("en-GB");

    page.drawText(dateText, {
      x: 230,
      y: 145,
      size: 16,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
    });

    // ===============================
    // 📦 EXPORT PDF
    // ===============================
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=WorkHatch_Certificate.pdf",
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}