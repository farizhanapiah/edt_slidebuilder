export type DeckType = "pitch" | "case_study" | "product" | "recap";
export type DeckStatus = "draft" | "published" | "archived";

export const DECK_TYPE_LABELS: Record<DeckType, string> = {
  pitch: "PITCH DECK",
  case_study: "CASE STUDY",
  product: "PRODUCT",
  recap: "EVENT RECAP",
};

export interface Deck {
  id: string;
  title: string;
  client_name: string;
  deck_type: DeckType;
  status: DeckStatus;
  share_token: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}
