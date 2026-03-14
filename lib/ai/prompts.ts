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
"hero_impact": { headline, headline_size: "xl"|"xxl", subtext: "", background_image_url: "", overlay_opacity: 55, text_alignment: "left"|"center"|"right", accent_bar: true, show_logo: false }
"big_number": { eyebrow, number, label, context: "", background_image_url: "", overlay_opacity: 70, accent_color: "blue"|"white" }
"icon_grid": { eyebrow, headline, items: [{ icon: "<emoji>", label, description: "" }], columns: 2|3|4, style: "minimal"|"cards"|"window_chrome", background_color: "black"|"blue" }
"comparison": { headline: "", eyebrow, left_label, left_image_url: "", left_image_alt, left_points: [], right_label, right_image_url: "", right_image_alt, right_points: [], divider_style: "line"|"vs"|"arrow" }
"team": { eyebrow, headline, members: [{ name, title, image_url: "", image_alt }], layout: "grid"|"row", show_window_chrome: true }

Structure guidelines for a ${deckTypeLabel}:
- Always start with a "cover" slide
- Use "section_divider" slides to separate major sections (numbered 01, 02, 03...)
- End with a "thank_you" slide
- Aim for 10–16 slides total to allow for template variety

CRITICAL — TEMPLATE VARIETY IS MANDATORY:
- You MUST use at least 8 DIFFERENT layout types per deck. Never repeat the same layout type more than twice (except section_divider which can repeat as needed).
- NEVER use "content_list" or "text_image" back-to-back. Alternate between visual and text-based types.
- NEVER create 3+ text-heavy slides in a row. After any text slide, the next MUST be a visual type (hero_impact, big_number, full_bleed_image, comparison, icon_grid, image_gallery, or chart).
- Every deck MUST include at least one of EACH of these visual types: hero_impact, big_number, icon_grid.
- Treat the 19 layout types as a palette — use as many as the content allows. A good deck uses 10+ different types.

Visual-first guidelines — PRIORITIZE visual slide types:
- Use "hero_impact" for key messages, bold statements, and section openers (2-5 word headlines only). Use at least 2 per deck.
- Use "big_number" for ANY standout metric, percentage, or result. NEVER put a single stat inside a "stats" slide — always use "big_number" instead.
- Use "icon_grid" for features, services, capabilities, or any list of 3-6 items with short labels. ALWAYS prefer this over "content_list" unless items need long descriptions.
- Use "comparison" for before/after, problem/solution, A vs B, old vs new, or any two-sided argument.
- Use "team" to introduce people with photos.
- Use "full_bleed_image" or "image_gallery" to create visual breathing room between text-heavy sections.
- Use "chart" for any data that can be visualized (trends, distributions, comparisons).
- Use "quote" to break up sections with a powerful testimonial or statement.
- Keep text minimal: headlines 2-5 words, body copy 1-2 short sentences max.
- Every deck MUST have at least 4 image-centric slides (hero_impact, full_bleed_image, comparison, text_image, or image_gallery).

Recommended deck flows (adapt based on content, but ALWAYS maximize type variety):
- For case studies (12-16 slides): cover → hero_impact (project name, dramatic) → section_divider (challenge) → text_image (problem context) → comparison (before/after) → section_divider (solution) → icon_grid (approach/tools) → full_bleed_image (process shot) → section_divider (results) → big_number (hero metric) → stats (supporting data, 3-4 items) → chart (trend/growth) → quote (client testimonial) → team (project team) → thank_you
- For pitch decks (12-16 slides): cover → hero_impact (bold statement) → section_divider (problem) → big_number (market size/pain point) → comparison (current vs ideal) → section_divider (solution) → icon_grid (capabilities) → text_image (how it works) → full_bleed_image (product shot) → section_divider (results) → stats (proof points) → chart (growth/traction) → team → quote (endorsement) → thank_you
- For event recaps (10-14 slides): cover → hero_impact (event name) → full_bleed_image (hero shot) → big_number (attendance) → icon_grid (highlights) → image_gallery (moments) → stats (engagement metrics) → comparison (goals vs actual) → quote (attendee quote) → timeline (event journey) → thank_you
- For proposals (12-16 slides): cover → hero_impact (vision statement) → section_divider (understanding) → text_image (client context) → comparison (challenge/opportunity) → section_divider (approach) → icon_grid (methodology) → timeline (phases) → section_divider (investment) → table (pricing) → big_number (ROI) → team → thank_you
- For reports (12-16 slides): cover → hero_impact (key finding) → big_number (headline metric) → section_divider (analysis) → chart (primary data) → stats (supporting metrics) → comparison (benchmark) → icon_grid (takeaways) → text_image (deep dive) → section_divider (next steps) → content_list (action items) → thank_you

Write all content in EDT's voice: direct, punchy, results-first. No buzzwords.
Stats must use specific numbers (52,417 not "50k+"). Headlines must be SHORT — 2-5 words max.
REMEMBER: Variety is king. A mundane deck repeats layouts. A great deck surprises with every slide.`;
}

export function buildRewriteSlidePrompt(slide: Slide, instruction?: string): string {
  const layoutLabel = LAYOUT_TYPE_LABELS[slide.layout_type];
  const defaultInstruction = "Make the copy more direct and punchy. Reduce word count by 30%. Remove any generic or vague language. Keep it bold and results-focused. Headlines must be 2-5 words max. Body text must be 1-2 short sentences. Less text = more visual impact.";

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
- MAXIMIZE template variety: if the deck uses fewer than 8 different layout types, suggest adding visual types it's missing (hero_impact, big_number, icon_grid, comparison, full_bleed_image, chart, quote)
- Never allow 3+ text-heavy slides in a row — suggest inserting a visual slide between them
- If the same layout type appears 3+ times, suggest replacing one with a different type that fits the content
- Replace any single-stat "stats" slide with "big_number"
- Replace any short-item "content_list" with "icon_grid" when items have labels under 6 words
- Output raw JSON array only.`;
}

function getSlideTitle(slide: Slide): string {
  const c = slide.content as unknown as Record<string, unknown>;
  return (c.headline as string) || (c.section_title as string) || (c.quote_text as string)?.slice(0, 40) || slide.layout_type;
}
