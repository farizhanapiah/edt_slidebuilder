import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { generateDeckPdf } from "@/lib/pdf/export";
import { headers } from "next/headers";

export const maxDuration = 60;

type Params = { params: Promise<{ deckId: string }> };

export async function GET(request: Request, { params }: Params) {
  const { deckId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify user owns this deck
  const { data: deck } = await supabase
    .from("decks")
    .select("id, title")
    .eq("id", deckId)
    .eq("created_by", user.id)
    .single();

  if (!deck) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const pdfBuffer = await generateDeckPdf(deckId, baseUrl);
    const filename = encodeURIComponent(deck.title ?? "deck") + ".pdf";

    return new Response(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
