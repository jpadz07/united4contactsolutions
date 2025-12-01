import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from("team").select("*").order("id", { ascending: true });

    if (error) throw error;

    // Parse JSON strings
    const team = (data || []).map((member: any) => ({
      ...member,
      skills: typeof member.skills === "string" ? JSON.parse(member.skills) : member.skills,
      projects: typeof member.projects === "string" ? JSON.parse(member.projects) : member.projects,
    }));

    return NextResponse.json(team);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { team } = body; // Array of team members

    // Delete all existing team members
    await supabaseAdmin.from("team").delete().neq("id", 0);

    // Insert new team members
    const teamToInsert = team.map((member: any) => ({
      name: member.name,
      role: member.role,
      icon: member.icon,
      bio: member.bio,
      skills: JSON.stringify(member.skills || []),
      experience: member.experience,
      email: member.email,
      projects: JSON.stringify(member.projects || []),
      updated_at: new Date().toISOString(),
    }));

    const { data, error } = await supabaseAdmin.from("team").insert(teamToInsert).select();

    if (error) throw error;

    // Parse JSON for response
    const result = (data || []).map((member: any) => ({
      ...member,
      skills: typeof member.skills === "string" ? JSON.parse(member.skills) : member.skills,
      projects: typeof member.projects === "string" ? JSON.parse(member.projects) : member.projects,
    }));

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

