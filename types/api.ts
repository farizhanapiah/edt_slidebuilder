import type { Deck } from "./deck";
import type { Slide, LayoutType, SlideContent } from "./slide";

export interface ApiError {
  error: string;
}

export interface CreateDeckBody {
  title: string;
  client_name: string;
  deck_type: Deck["deck_type"];
}

export interface UpdateDeckBody {
  title?: string;
  client_name?: string;
  deck_type?: Deck["deck_type"];
  status?: Deck["status"];
}

export interface CreateSlideBody {
  layout_type: LayoutType;
  position?: number;
  content?: Partial<SlideContent>;
}

export interface UpdateSlideBody {
  content?: Partial<SlideContent>;
  position?: number;
  layout_type?: LayoutType;
}

export interface ReorderSlidesBody {
  ordered_ids: string[];
}

export interface GenerateDeckBody {
  title: string;
  client_name: string;
  deck_type: Deck["deck_type"];
  brief: string;
}

export interface RewriteSlideBody {
  slide: Slide;
  instruction?: string;
}

export interface SuggestStructureBody {
  deck_id: string;
}

export interface SuggestedStructureItem {
  action: "keep" | "move" | "add" | "remove";
  slide_id?: string;
  new_position: number;
  layout_type?: LayoutType;
  reason: string;
}

export interface UploadResponse {
  url: string;
  path: string;
}
