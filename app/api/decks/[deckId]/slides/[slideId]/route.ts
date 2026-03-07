import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { UpdateSlideBody, ReorderSlidesBody } from "@/types/api";

type Params = { params: Promise<{ deckId: string; slideId: string }> };

// PATCH /api/decks/[deckId]/slides/[slideId]
export async function PATCH(request: Request, { params }: Params) {
  const { deckId, slideId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: UpdateSlideBody = await request.json();

  // Build update payload — merge content if provided
  const updatePayload: Record<string, unknown> = {};
  if (body.layout_type) updatePayload.layout_type = body.layout_type;
  if (body.position !== undefined) updatePayload.position = body.position;

  if (body.content) {
    // Fetch current content and merge
    const { data: current } = await supabase
      .from("slides")
      .select("content")
      .eq("id", slideId)
      .single();

    updatePayload.content = { ...(current?.content ?? {}), ...body.content };
  }

  const { data, error } = await supabase
    .from("slides")
    .update(updatePayload)
    .eq("id", slideId)
    .eq("deck_id", deckId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

// DELETE /api/decks/[deckId]/slides/[slideId]
export async function DELETE(_req: Request, { params }: Params) {
  const { deckId, slideId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("slides")
    .delete()
    .eq("id", slideId)
    .eq("deck_id", deckId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new Response(null, { status: 204 });
}
