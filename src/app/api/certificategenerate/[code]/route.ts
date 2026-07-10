import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Interndata from "@/models/Interndata";
import QRCode from "qrcode";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// ===========================
// Wrap Text Helper
// ===========================
function wrapText(
  text: string,
  font: any,
  size: number,
  maxWidth: number
) {
  const words = text.split(" ");

  const lines: string[] = [];

  let line = "";

  for (const word of words) {
    const testLine = line
      ? `${line} ${word}`
      : word;

    const width = font.widthOfTextAtSize(
      testLine,
      size
    );

    if (width <= maxWidth) {
      line = testLine;
    } else {
      lines.push(line);
      line = word;
    }
  }

  if (line) lines.push(line);

  return lines;
}


// ===========================
// GET API
// ===========================

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    await connectDB();

    const { code } = await params;

    const credential = await Interndata.findOne({
      credentialId: code,
    });

    if (!credential) {
      return NextResponse.json(
        { error: "Credential not found" },
        { status: 404 }
      );
    }

    // ===========================
    // Create PDF
    // ===========================
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([1200, 850]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width } = page.getSize();

    // ===========================
    // Certificate Background
    // ===========================
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

    const imageBytes = await fetch(
      `${baseUrl}/intern_certificate.png`
    ).then((res) => res.arrayBuffer());

    const background = await pdfDoc.embedPng(imageBytes);

    page.drawImage(background, {
      x: 0,
      y: 0,
      width: 1200,
      height: 850,
    });

    // ===========================
    // QR Code
    // ===========================
    const verificationUrl = `${baseUrl}/credentials/${credential.credentialId}`;

    const qrDataUrl = await QRCode.toDataURL(verificationUrl);

    const qrBytes = Buffer.from(
      qrDataUrl.replace(/^data:image\/png;base64,/, ""),
      "base64"
    );

    const qrImage = await pdfDoc.embedPng(qrBytes);

    page.drawImage(qrImage, {
      x: 950,
      y: 95,
      width: 105,
      height: 105,
    });

   // ===========================
// Name
// ===========================
const name = credential.name;

const nameSize = 42;

const nameWidth = font.widthOfTextAtSize(
  name,
  nameSize
);

page.drawText(name, {
  x: (width - nameWidth) / 2,
  y: 420,
  size: nameSize,
  font: font,
  color: rgb(0, 0, 0),
});
  

   
    // ===========================
    // Credential ID
    // ===========================
    page.drawText(credential.credentialId, {
      x:955,
      y:80,
      size:11,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });

   // ===========================
// Description
// ===========================

const descriptionSize = 19;

const lines = wrapText(
  credential.details,
  font,
  descriptionSize,
  760
);

let y = 360;

for (const line of lines) {

  const textWidth = font.widthOfTextAtSize(
    line,
    descriptionSize
  );

  page.drawText(line, {
    x: (width - textWidth) / 2,
    y,
    size: descriptionSize,
    font,
    color: rgb(0.18, 0.18, 0.18),
  });

  y -= 28;
}

    // ===========================
    // Save PDF
    // ===========================
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${credential.credentialId}.pdf`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}