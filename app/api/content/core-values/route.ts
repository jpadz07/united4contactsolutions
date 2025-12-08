import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { verifyRequestAuth } from "@/lib/auth/middleware";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("core_values")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    const { values } = body; // Array of core values

    // Delete all existing values
    await supabaseAdmin.from("core_values").delete().neq("id", 0);

    // Insert new values
    const valuesToInsert = values.map((value: any, index: number) => ({
      // Save icon ID if it's not a data URL (uploaded image), otherwise save the data URL
      // If empty string, save empty string (not null) to avoid constraint violation
      icon: value.icon && value.icon.startsWith("data:image") 
        ? value.icon 
        : (value.icon || ""), // Use empty string instead of null
      title: value.title,
      description: value.desc,
      color: value.color,
      order: index,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabaseAdmin
      .from("core_values")
      .insert(valuesToInsert)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

