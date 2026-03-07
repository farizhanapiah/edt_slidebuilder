import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { anthropic, EDT_SYSTEM_PROMPT } from "@/lib/ai/client";
import { buildRewriteSlidePrompt } from "@/lib/ai/prompts";
import type { RewriteSlideBody } from "@/types/api";

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: RewriteSlideBody = await request.json();

  const prompt = buildRewriteSlidePrompt(body.slide, body.instruction);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: EDT_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText =
    message.content[0].type === "text" ? message.content[0].text : "";
  // Extract JSON object — find first { and last }
  const start = rawText.indexOf("{");
  const end = rawText.lastIndexOf("}");
  const jsonText = start !== -1 && end > start ? rawText.slice(start, end + 1) : rawText.trim();

  let newContent: Record<string, unknown>;
  try {
    newContent = JSON.parse(jsonText);
  } catch {
    return NextResponse.json(
      { error: "AI returned invalid JSON", raw: rawText.slice(0, 300) },
      { status: 422 }
    );
  }

  // Save the updated content back to the slide
  const { data, error } = await supabase
    .from("slides")
    .update({ content: { ...(body.slide.content as object), ...newContent } })
    .eq("id", body.slide.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
