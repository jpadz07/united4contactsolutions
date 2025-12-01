import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("header")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" - we'll return default data
      throw error;
    }

    return NextResponse.json(data || null);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_name, tagline } = body;

    // Upsert (insert or update)
    const { data, error } = await supabaseAdmin
      .from("header")
      .upsert(
        {
          company_name,
          tagline,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

