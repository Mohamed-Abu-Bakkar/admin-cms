import { clearAuthCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  await clearAuthCookie();
  return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000"));
}