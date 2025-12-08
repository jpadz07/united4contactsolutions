import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/auth/credentials";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Verify credentials
    const isValid = verifyCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate session token
    const token = btoa(`${Date.now()}-${Math.random().toString(36).substring(2, 15)}`);
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours

    // Return session data (client will store it)
    return NextResponse.json({
      success: true,
      session: {
        email,
        token,
        expiresAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Login failed" },
      { status: 500 }
    );
  }
}





