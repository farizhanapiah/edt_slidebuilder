import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { anthropic, EDT_SYSTEM_PROMPT } from "@/lib/ai/client";
import { buildGenerateDeckPrompt } from "@/lib/ai/prompts";
import { SLIDE_DEFAULTS } from "@/lib/slides/defaults";
import type { GenerateDeckBody } from "@/types/api";
import type { LayoutType } from "@/types/slide";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: GenerateDeckBody & { deck_id: string } = await request.json();

  if (!body.brief?.trim()) {
    return NextResponse.json({ error: "Brief is required" }, { status: 400 });
  }

  const prompt = buildGenerateDeckPrompt({
    title: body.title,
    client_name: body.client_name,
    deck_type: body.deck_type,
    brief: body.brief,
  });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: EDT_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText =
    message.content[0].type === "text" ? message.content[0].text : "";

  // Extract JSON array — find first [ and last ]
  const start = rawText.indexOf("[");
  const end = rawText.lastIndexOf("]");
  const jsonText = start !== -1 && end > start ? rawText.slice(start, end + 1) : rawText.trim();

  console.log("[generate-deck] raw AI response:", rawText.slice(0, 300));

  let generatedSlides: { layout_type: LayoutType; content: Record<string, unknown> }[];
  try {
    generatedSlides = JSON.parse(jsonText);
    if (!Array.isArray(generatedSlides)) throw new Error("Not an array");
  } catch {
    console.error("[generate-deck] JSON parse failed. Raw:", rawText.slice(0, 800));
    return NextResponse.json(
      { error: "AI returned invalid JSON", raw: rawText.slice(0, 500) },
      { status: 422 }
    );
  }

  // Delete existing slides for this deck (if regenerating)
  if (body.deck_id) {
    await supabase.from("slides").delete().eq("deck_id", body.deck_id);
  }

  // Insert new slides
  const slidesToInsert = generatedSlides.map((s, i) => ({
    deck_id: body.deck_id,
    position: i,
    layout_type: s.layout_type,
    content: { ...SLIDE_DEFAULTS[s.layout_type], ...s.content },
  }));

  const { data: slides, error } = await supabase
    .from("slides")
    .insert(slidesToInsert)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(slides, { status: 201 });
}
