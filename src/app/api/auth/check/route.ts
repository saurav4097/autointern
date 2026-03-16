import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {

  const cookieStore = await cookies();   // ← FIX

  const token = cookieStore.get("token");

  if (!token) {
    return NextResponse.json({ loggedIn: false }, { status: 401 });
  }

  return NextResponse.json({ loggedIn: true });
}
