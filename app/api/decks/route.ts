import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { CreateDeckBody } from "@/types/api";

// GET /api/decks — list all decks (visible to all authenticated users)
export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/decks — create a new deck
export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: CreateDeckBody = await request.json();

  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!body.client_name?.trim()) {
    return NextResponse.json({ error: "Client name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("decks")
    .insert({
      title: body.title.trim(),
      client_name: body.client_name.trim(),
      deck_type: body.deck_type || "pitch",
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
