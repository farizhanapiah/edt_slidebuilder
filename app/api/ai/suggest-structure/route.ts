import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { anthropic, EDT_SYSTEM_PROMPT } from "@/lib/ai/client";
import { buildSuggestStructurePrompt } from "@/lib/ai/prompts";
import type { SuggestStructureBody } from "@/types/api";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { deck_id }: SuggestStructureBody = await request.json();

  // Fetch deck and slides
  const [{ data: deck }, { data: slides }] = await Promise.all([
    supabase.from("decks").select("*").eq("id", deck_id).single(),
    supabase.from("slides").select("*").eq("deck_id", deck_id).order("position"),
  ]);

  if (!deck) return NextResponse.json({ error: "Deck not found" }, { status: 404 });

  const prompt = buildSuggestStructurePrompt(deck, slides ?? []);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: EDT_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText =
    message.content[0].type === "text" ? message.content[0].text : "";
  const jsonText = rawText
    .replace(/^```json?\n?/, "")
    .replace(/```$/, "")
    .trim();

  let suggestions;
  try {
    suggestions = JSON.parse(jsonText);
  } catch {
    return NextResponse.json(
      { error: "AI returned invalid JSON", raw: rawText.slice(0, 300) },
      { status: 422 }
    );
  }

  return NextResponse.json({ suggestions, slides });
}
