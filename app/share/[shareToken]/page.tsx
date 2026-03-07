import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { PublicDeckViewer } from "@/components/share/PublicDeckViewer";
import type { Deck } from "@/types/deck";
import type { Slide } from "@/types/slide";

interface Props {
  params: Promise<{ shareToken: string }>;
}

export default async function SharePage({ params }: Props) {
  const { shareToken } = await params;
  const supabase = await createServiceClient();

  const { data: deck } = await supabase
    .from("decks")
    .select("*")
    .eq("share_token", shareToken)
    .single();

  if (!deck) notFound();

  const { data: slides } = await supabase
    .from("slides")
    .select("*")
    .eq("deck_id", deck.id)
    .order("position", { ascending: true });

  return (
    <PublicDeckViewer
      deck={deck as Deck}
      slides={(slides ?? []) as Slide[]}
      shareToken={shareToken}
    />
  );
}

export async function generateMetadata({ params }: Props) {
  const { shareToken } = await params;
  const supabase = await createServiceClient();
  const { data: deck } = await supabase
    .from("decks")
    .select("title, client_name")
    .eq("share_token", shareToken)
    .single();

  if (!deck) return { title: "EDT Presentation" };
  return {
    title: `${deck.title} — ${deck.client_name} | EDT`,
    robots: { index: false, follow: false },
  };
}
