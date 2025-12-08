import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { verifyRequestAuth } from "@/lib/auth/middleware";

export async function GET() {
  try {
    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: "Database not configured" 
      }, { status: 503 });
    }

    const { data, error } = await supabaseAdmin
      .from("hero")
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Not found - return null (will use defaults on frontend)
        console.log("Hero not found in database, returning null");
        return NextResponse.json(null, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
      }
      // Other error
      console.error("Hero GET error:", error);
      return NextResponse.json({ 
        error: "Database query failed", 
        details: error.message 
      }, { status: 500 });
    }

    console.log("Hero data from database:", JSON.stringify(data, null, 2));
    if (!data) {
      console.log("No hero data found, returning null");
      return NextResponse.json(null, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error("Hero GET error:", error);
    return NextResponse.json({ 
      error: error.message || "Internal server error" 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = verifyRequestAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { headline, subheadline, description, cta_primary, cta_secondary } = body;

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ 
        error: "Database not configured. Please check your environment variables." 
      }, { status: 503 });
    }

    // Check if hero exists
    const { data: existingData } = await supabaseAdmin
      .from("hero")
      .select("id")
      .single();

    let result;
    if (existingData && existingData.id) {
      // Update existing row
      result = await supabaseAdmin
        .from("hero")
        .update({
          headline,
          subheadline,
          description,
          cta_primary,
          cta_secondary,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingData.id)
        .select()
        .single();
    } else {
      // Insert new row
      result = await supabaseAdmin
        .from("hero")
        .insert({
          headline,
          subheadline,
          description,
          cta_primary,
          cta_secondary,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
    }

    const { data, error } = result;

    if (error) {
      console.error("Hero save error:", error);
      return NextResponse.json({ 
        error: "Failed to save to database", 
        details: error.message,
        code: error.code 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data,
      message: "Hero section saved successfully" 
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error("Hero POST error:", error);
    return NextResponse.json({ 
      error: error.message || "Internal server error" 
    }, { status: 500 });
  }
}

