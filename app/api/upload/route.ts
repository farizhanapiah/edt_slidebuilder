import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const deckId = formData.get("deckId") as string | null;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
  }

  // Use service client for storage and DB lookups (auth already verified above)
  const serviceClient = await createServiceClient();

  // Build a human-readable folder name from the deck client name + title
  let folderName = deckId ?? "shared";
  if (deckId) {
    const { data: deck } = await serviceClient
      .from("decks")
      .select("title, client_name")
      .eq("id", deckId)
      .single();
    if (deck) {
      const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      folderName = `${slug(deck.client_name)}_${slug(deck.title)}`;
    }
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${folderName}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { data, error } = await serviceClient.storage
    .from("slide-images")
    .upload(filename, buffer, { contentType: file.type, upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Return a signed URL valid for 1 year
  const { data: signedData } = await serviceClient.storage
    .from("slide-images")
    .createSignedUrl(data.path, 60 * 60 * 24 * 365);

  return NextResponse.json({
    url: signedData?.signedUrl ?? "",
    path: data.path,
  });
}
