import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { SLIDE_DEFAULTS } from "@/lib/slides/defaults";
import type { CreateSlideBody } from "@/types/api";

type Params = { params: Promise<{ deckId: string }> };

// GET /api/decks/[deckId]/slides
export async function GET(_req: Request, { params }: Params) {
  const { deckId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("slides")
    .select("*")
    .eq("deck_id", deckId)
    .order("position", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/decks/[deckId]/slides
export async function POST(request: Request, { params }: Params) {
  const { deckId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: CreateSlideBody = await request.json();

  // Get current max position
  const { data: existing } = await supabase
    .from("slides")
    .select("position")
    .eq("deck_id", deckId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing?.[0]?.position != null ? existing[0].position + 1 : 0;
  const position = body.position ?? nextPosition;

  const defaultContent = SLIDE_DEFAULTS[body.layout_type] ?? {};
  const content = { ...defaultContent, ...(body.content ?? {}) };

  const { data, error } = await supabase
    .from("slides")
    .insert({
      deck_id: deckId,
      position,
      layout_type: body.layout_type,
      content,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
