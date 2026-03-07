import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { deck_id, name, email, rating, comment } = body;

  if (!deck_id || !name?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // Verify deck exists
  const { data: deck } = await supabase
    .from("decks")
    .select("id, title, client_name, created_by")
    .eq("id", deck_id)
    .single();

  if (!deck) return NextResponse.json({ error: "Deck not found" }, { status: 404 });

  // Store in Supabase
  const { error: insertError } = await supabase.from("feedback").insert({
    deck_id,
    name: name.trim(),
    email: email?.trim() || null,
    rating: rating || null,
    comment: comment?.trim() || null,
  });

  if (insertError) {
    console.error("Feedback insert error:", insertError);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }

  // Forward to Formspree for email notification
  const formspreeId = process.env.FORMSPREE_FORM_ID;
  if (formspreeId) {
    try {
      const stars = rating ? "★".repeat(rating) + "☆".repeat(5 - rating) : "No rating";
      await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: `New feedback on "${deck.title}" — ${deck.client_name}`,
          Deck: deck.title,
          Client: deck.client_name,
          Name: name.trim(),
          Email: email?.trim() || "—",
          Rating: stars,
          Comments: comment?.trim() || "—",
        }),
      });
    } catch (err) {
      console.error("Formspree error:", err);
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
