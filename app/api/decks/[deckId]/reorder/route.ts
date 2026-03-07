import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { ReorderSlidesBody } from "@/types/api";

type Params = { params: Promise<{ deckId: string }> };

// POST /api/decks/[deckId]/reorder
export async function POST(request: Request, { params }: Params) {
  const { deckId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: ReorderSlidesBody = await request.json();

  const { error } = await supabase.rpc("reorder_slides", {
    p_deck_id: deckId,
    p_ordered_ids: body.ordered_ids,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
