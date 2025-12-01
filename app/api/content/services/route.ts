import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { verifyRequestAuth } from "@/lib/auth/middleware";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .order("order", { ascending: true });

    if (error) throw error;

    // Parse features JSON strings
    const services = (data || []).map((service: any) => ({
      ...service,
      features: typeof service.features === "string" ? JSON.parse(service.features) : service.features,
    }));

    return NextResponse.json(services);
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
    const { services } = body; // Array of services

    // Delete all existing services
    await supabaseAdmin.from("services").delete().neq("id", 0);

    // Insert new services
    const servicesToInsert = services.map((service: any, index: number) => ({
      title: service.title,
      description: service.desc || service.description,
      icon: service.icon,
      features: JSON.stringify(service.features || []),
      order: index,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabaseAdmin
      .from("services")
      .insert(servicesToInsert)
      .select();

    if (error) throw error;

    // Parse features for response
    const result = (data || []).map((service: any) => ({
      ...service,
      features: typeof service.features === "string" ? JSON.parse(service.features) : service.features,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

