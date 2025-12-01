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
      icon: value.icon,
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

