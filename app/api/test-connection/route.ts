import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Test database connection by querying a simple table
    const { data, error } = await supabaseAdmin
      .from("header")
      .select("id")
      .limit(1);

    if (error) {
      // Check if it's a "table doesn't exist" error or connection error
      if (error.code === "PGRST116" || error.message.includes("relation") || error.message.includes("does not exist")) {
        return NextResponse.json({
          connected: false,
          error: "Database tables not found. Please run the schema.sql file in Supabase.",
          details: error.message,
        }, { status: 503 });
      }

      return NextResponse.json({
        connected: false,
        error: "Database connection failed",
        details: error.message,
        code: error.code,
      }, { status: 503 });
    }

    // Check environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return NextResponse.json({
      connected: true,
      message: "Database connection successful",
      env: {
        hasUrl,
        hasServiceKey,
        hasAnonKey,
      },
      testQuery: data !== null ? "success" : "no data",
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      error: "Unexpected error",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    }, { status: 500 });
  }
}

