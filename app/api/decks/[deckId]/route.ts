import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { UpdateDeckBody } from "@/types/api";

type Params = { params: Promise<{ deckId: string }> };

// GET /api/decks/[deckId]
export async function GET(_req: Request, { params }: Params) {
  const { deckId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("decks")
    .select("*")
    .eq("id", deckId)
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

// PATCH /api/decks/[deckId]
export async function PATCH(request: Request, { params }: Params) {
  const { deckId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: UpdateDeckBody = await request.json();

  const { data, error } = await supabase
    .from("decks")
    .update(body)
    .eq("id", deckId)
    .eq("created_by", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

// DELETE /api/decks/[deckId]
export async function DELETE(_req: Request, { params }: Params) {
  const { deckId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("decks")
    .delete()
    .eq("id", deckId)
    .eq("created_by", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}
