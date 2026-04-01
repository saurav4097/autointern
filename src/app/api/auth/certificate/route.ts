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
const page = pdfDoc.addPage([900, 650]);

const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

const { width, height } = page.getSize();

// 🎨 COLORS
const green = rgb(0, 0.6, 0);
const dark = rgb(0.1, 0.1, 0.1);
const lightGray = rgb(0.9, 0.9, 0.9);

// 🟩 OUTER BORDER
page.drawRectangle({
  x: 20,
  y: 20,
  width: width - 40,
  height: height - 40,
  borderWidth: 3,
  borderColor: green,
});

// ⬛ INNER BORDER
page.drawRectangle({
  x: 40,
  y: 40,
  width: width - 80,
  height: height - 80,
  borderWidth: 1,
  borderColor: lightGray,
});

// 🏷️ BRAND NAME
page.drawText("WorkHatch", {
  x: width / 2 - 60,
  y: height - 80,
  size: 24,
  font: fontBold,
  color: dark,
});

page.drawText("Build Real Skills Through Real Work", {
  x: width / 2 - 130,
  y: height - 105,
  size: 10,
  font: fontRegular,
  color: green,
});

// 🎓 TITLE
page.drawText("CERTIFICATE OF COMPLETION", {
  x: width / 2 - 180,
  y: height - 160,
  size: 28,
  font: fontBold,
  color: green,
});

// LINE
page.drawLine({
  start: { x: 150, y: height - 170 },
  end: { x: width - 150, y: height - 170 },
  thickness: 1,
  color: lightGray,
});

// 👤 NAME LABEL
page.drawText("This is proudly presented to", {
  x: width / 2 - 130,
  y: height - 220,
  size: 14,
  font: fontRegular,
  color: dark,
});

// 👤 USER NAME (BIG)
page.drawText(user.name.toUpperCase(), {
  x: width / 2 - (user.name.length * 6),
  y: height - 260,
  size: 26,
  font: fontBold,
  color: dark,
});

// UNDERLINE NAME
page.drawLine({
  start: { x: width / 2 - 150, y: height - 270 },
  end: { x: width / 2 + 150, y: height - 270 },
  thickness: 1,
  color: lightGray,
});

// 📄 DESCRIPTION
page.drawText(
  `For successfully completing the ${intern.role.toUpperCase()} Internship Program`,
  {
    x: width / 2 - 220,
    y: height - 310,
    size: 14,
    font: fontRegular,
  }
);

page.drawText(
  `demonstrating strong problem-solving skills and practical implementation.`,
  {
    x: width / 2 - 230,
    y: height - 335,
    size: 12,
    font: fontRegular,
    color: rgb(0.3, 0.3, 0.3),
  }
);

// 📅 DURATION
page.drawText(
  `Duration: ${new Date(intern.startDate).toDateString()}  -  ${new Date(
    intern.endDate
  ).toDateString()}`,
  {
    x: width / 2 - 180,
    y: height - 380,
    size: 12,
    font: fontRegular,
  }
);

// ✍️ SIGNATURE LINE
page.drawLine({
  start: { x: width - 250, y: 120 },
  end: { x: width - 100, y: 120 },
  thickness: 1,
  color: dark,
});

page.drawText("Authorized Signature", {
  x: width - 240,
  y: 100,
  size: 10,
  font: fontRegular,
});

// 🏁 FOOTER
page.drawText("WorkHatch Team", {
  x: 80,
  y: 100,
  size: 12,
  font: fontBold,
  color: green,
});

page.drawText("Empowering Talent • Connecting Opportunities", {
  x: 80,
  y: 80,
  size: 9,
  font: fontRegular,
  color: rgb(0.5, 0.5, 0.5),
});
 
const pdfBytes = await pdfDoc.save();
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=certificate.pdf",
    },
  });
}