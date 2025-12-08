import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // In a real app, verify token against database or JWT
    // For now, we'll do basic validation
    try {
      const decoded = atob(token);
      const [timestamp] = decoded.split("-");
      const tokenAge = Date.now() - parseInt(timestamp);
      
      // Token expires after 2 hours
      if (tokenAge > 2 * 60 * 60 * 1000) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }

      return NextResponse.json({ authenticated: true });
    } catch {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}





