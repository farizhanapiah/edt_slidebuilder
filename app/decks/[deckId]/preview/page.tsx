import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { PublicDeckViewer } from "@/components/share/PublicDeckViewer";
import type { Deck } from "@/types/deck";
import type { Slide } from "@/types/slide";

interface Props {
  params: Promise<{ deckId: string }>;
  searchParams: Promise<{ exportToken?: string }>;
}

export default async function PreviewPage({ params, searchParams }: Props) {
  const { deckId } = await params;
  const { exportToken } = await searchParams;

  // Validate export token (middleware also checks, this is a belt-and-suspenders)
  if (exportToken !== process.env.EXPORT_SECRET) {
    notFound();
  }

  const supabase = await createServiceClient();

  const { data: deck } = await supabase
    .from("decks")
    .select("*")
    .eq("id", deckId)
    .single();

  if (!deck) notFound();

  const { data: slides } = await supabase
    .from("slides")
    .select("*")
    .eq("deck_id", deckId)
    .order("position", { ascending: true });

  return (
    <PublicDeckViewer
      deck={deck as Deck}
      slides={(slides ?? []) as Slide[]}
      isExportMode
    />
  );
}
