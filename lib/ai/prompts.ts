import type { Deck } from "@/types/deck";
import type { Slide } from "@/types/slide";
import { DECK_TYPE_LABELS } from "@/types/deck";
import { LAYOUT_TYPE_LABELS } from "@/types/slide";

export function buildGenerateDeckPrompt(params: {
  title: string;
  client_name: string;
  deck_type: Deck["deck_type"];
  brief: string;
}): string {
  const deckTypeLabel = DECK_TYPE_LABELS[params.deck_type];

  return `Create a ${deckTypeLabel} presentation for "${params.client_name}".

Deck title: ${params.title}

Brief:
${params.brief}

Output a JSON array of slides. Each slide must follow this exact shape:
{
  "layout_type": "<type>",
  "content": { <layout-specific fields> }
}

Valid layout types and their required content fields:

"cover": { eyebrow, headline, subheadline, client_name, deck_type_label, show_logo: true, background_image_url: "" }
"section_divider": { section_number, section_title, section_subtitle, background_color: "black"|"blue" }
"stats": { headline, stats: [{ value, label, window_title }], columns: 2|3|4 }
"text_image": { eyebrow, headline, body, image_url: "", image_alt, image_side: "left"|"right", image_caption: "" }
"full_bleed_image": { image_url: "", image_alt, overlay_opacity: 60, headline, subtext: "", text_position: "bottom-left", show_scan_lines: false }
"content_list": { eyebrow, headline, items: [{ text, highlight: false }], layout: "single-column"|"two-column", show_numbers: false }
"quote": { quote_text, attribution, context: "", background_color: "blue"|"black", show_quotation_mark: true }
"timeline": { headline, events: [{ date, title, description: "", is_milestone: false }], orientation: "horizontal"|"vertical" }
"thank_you": { headline, subheadline, contact_name: "EDT Team", contact_title: "Creative Director", contact_email: "hello@weareedt.com", website: "weareedt.com", show_logo: true, background_color: "black" }
"table": { headline, eyebrow, columns: [{ key, label, width: <positive integer, proportional — e.g. 25 means 25 parts; all column widths together determine relative sizing>, align: "left"|"center"|"right", format: "text"|"currency"|"number"|"percentage" }], rows: [{ <key>: <value> }], show_total_row: true, total_column: "<key>", currency_symbol: "$", highlight_last_column: true }
"chart": { headline, eyebrow, chart_type: "bar"|"bar_horizontal"|"line"|"area"|"pie"|"donut", data: [{ label, value }], value_prefix: "", value_suffix: "", series_label: "", show_legend: false, show_values: true, show_grid: true }
"video": { headline: "", video_url: "", caption: "", autoplay: false, show_controls: true, background_color: "black" }
"image_gallery": { headline: "", eyebrow: "", images: [], mode: "tiled"|"carousel"|"album_flow", tiled_layout: "2x2"|"2x3"|"3x2"|"1+2"|"1+3", show_captions: false, background_color: "black" }

Structure guidelines for a ${deckTypeLabel}:
- Always start with a "cover" slide
- Use "section_divider" slides to separate major sections (numbered 01, 02, 03...)
- Include at least one "stats" slide with real/placeholder metrics
- End with a "thank_you" slide
- Aim for 8–12 slides total
- For case studies: cover → challenge section → solution section → results (stats) → timeline → thank you
- For pitch decks: cover → problem section → solution section → product/service list → stats → team/timeline → thank you
- For event recaps: cover → event overview → highlights (stats) → image slide → quote → thank you

Write all content in EDT's voice: direct, punchy, results-first. No buzzwords.`;
}

export function buildRewriteSlidePrompt(slide: Slide, instruction?: string): string {
  const layoutLabel = LAYOUT_TYPE_LABELS[slide.layout_type];
  const defaultInstruction = "Make the copy more direct and punchy. Reduce word count by 30%. Remove any generic or vague language. Keep it bold and results-focused.";

  return `Rewrite the content for this ${layoutLabel} slide.

Current content (JSON):
${JSON.stringify(slide.content, null, 2)}

Instruction: ${instruction ?? defaultInstruction}

Return ONLY the updated content JSON object. Preserve ALL field names exactly as they appear above.
Do not add or remove any fields. Do not change boolean or numeric types.
Output raw JSON only — no explanation, no code fences.`;
}

export function buildSuggestStructurePrompt(deck: Deck, slides: Slide[]): string {
  const slideList = slides
    .map((s, i) => `${i + 1}. [${s.layout_type}] ${getSlideTitle(s)}`)
    .join("\n");

  return `This is a ${deck.deck_type} presentation deck titled "${deck.title}" for client "${deck.client_name}".

Current slide structure:
${slideList}

Suggest an improved slide order and structure for this type of deck.

Return a JSON array with this exact shape:
[
  {
    "action": "keep" | "move" | "add" | "remove",
    "slide_id": "<existing slide id or null for 'add' actions>",
    "new_position": <0-indexed integer>,
    "layout_type": "<for 'add' actions only>",
    "reason": "<one concise sentence explaining why>"
  }
]

Rules:
- Be specific — "move this stats slide after the results section" not "improve structure"
- Only suggest changes that genuinely improve the narrative flow
- Always keep a cover slide first and a thank_you slide last
- Output raw JSON array only.`;
}

function getSlideTitle(slide: Slide): string {
  const c = slide.content as unknown as Record<string, unknown>;
  return (c.headline as string) || (c.section_title as string) || (c.quote_text as string)?.slice(0, 40) || slide.layout_type;
}
