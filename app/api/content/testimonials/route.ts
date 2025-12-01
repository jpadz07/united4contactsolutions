import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("testimonials")
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
    const body = await request.json();
    const { testimonials } = body; // Array of testimonials

    // Delete all existing testimonials
    await supabaseAdmin.from("testimonials").delete().neq("id", 0);

    // Insert new testimonials
    const testimonialsToInsert = testimonials.map((testimonial: any, index: number) => ({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      quote: testimonial.quote,
      rating: testimonial.rating,
      result: testimonial.result,
      avatar: testimonial.avatar,
      order: index,
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabaseAdmin
      .from("testimonials")
      .insert(testimonialsToInsert)
      .select();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

