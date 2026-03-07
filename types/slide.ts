export type LayoutType =
  | "cover"
  | "section_divider"
  | "stats"
  | "text_image"
  | "full_bleed_image"
  | "content_list"
  | "quote"
  | "timeline"
  | "thank_you"
  | "table"
  | "chart"
  | "video"
  | "image_gallery";

export const LAYOUT_TYPE_LABELS: Record<LayoutType, string> = {
  cover: "Cover",
  section_divider: "Section Divider",
  stats: "Stats",
  text_image: "Text + Image",
  full_bleed_image: "Full Bleed Image",
  content_list: "Content List",
  quote: "Quote",
  timeline: "Timeline",
  thank_you: "Thank You",
  table: "Data Table",
  chart: "Chart",
  video: "Video",
  image_gallery: "Image Gallery",
};

/* ── Content schemas per layout type ── */

export interface CoverContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  client_name: string;
  deck_type_label: string;
  background_image_url?: string;
  show_logo: boolean;
}

export interface SectionDividerContent {
  section_number: string;
  section_title: string;
  section_subtitle?: string;
  background_color: "black" | "blue";
}

export interface StatItem {
  value: string;
  label: string;
  window_title: string;
}

export interface StatsContent {
  headline?: string;
  stats: StatItem[];
  columns: 2 | 3 | 4;
}

export interface TextImageContent {
  eyebrow?: string;
  headline: string;
  body: string;
  image_url: string;
  image_alt: string;
  image_side: "left" | "right";
  image_caption?: string;
}

export interface FullBleedImageContent {
  image_url: string;
  image_alt: string;
  overlay_opacity: number;
  headline?: string;
  subtext?: string;
  text_position: "top-left" | "bottom-left" | "center" | "bottom-right";
  show_scan_lines: boolean;
}

export interface ContentListItem {
  text: string;
  highlight?: boolean;
}

export interface ContentListContent {
  eyebrow?: string;
  headline: string;
  items: ContentListItem[];
  layout: "single-column" | "two-column";
  show_numbers: boolean;
}

export interface QuoteContent {
  quote_text: string;
  attribution?: string;
  context?: string;
  background_color: "blue" | "black";
  show_quotation_mark: boolean;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  is_milestone: boolean;
}

export interface TimelineContent {
  headline?: string;
  events: TimelineEvent[];
  orientation: "horizontal" | "vertical";
}

export interface ThankYouContent {
  headline: string;
  subheadline?: string;
  contact_name?: string;
  contact_title?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  show_logo: boolean;
  background_color: "black" | "blue";
}

/* ── New layout types ── */

export interface TableColumn {
  key: string;
  label: string;
  width: number; // percent of total width
  align: "left" | "center" | "right";
  format: "text" | "currency" | "number" | "percentage";
}

export interface TableContent {
  headline?: string;
  eyebrow?: string;
  columns: TableColumn[];
  rows: Record<string, string | number>[];
  show_total_row: boolean;
  total_column?: string;    // key of column to auto-sum
  currency_symbol?: string; // default "$"
  highlight_last_column: boolean;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  value2?: number; // optional second series
}

export type ChartType = "bar" | "bar_horizontal" | "line" | "area" | "pie" | "donut";

export interface ChartContent {
  headline?: string;
  eyebrow?: string;
  chart_type: ChartType;
  data: ChartDataPoint[];
  value_prefix?: string;  // e.g. "$"
  value_suffix?: string;  // e.g. "%", "k"
  series_label?: string;
  series2_label?: string;
  show_legend: boolean;
  show_values: boolean;
  show_grid: boolean;
  x_axis_label?: string;
  y_axis_label?: string;
}

export interface VideoContent {
  headline?: string;
  video_url: string; // YouTube, Vimeo, or direct .mp4 URL
  caption?: string;
  autoplay: boolean;
  show_controls: boolean;
  background_color: "black" | "blue";
}

export interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

export type GalleryMode = "carousel" | "tiled" | "album_flow";
export type TiledLayout = "2x2" | "2x3" | "3x2" | "1+2" | "1+3";

export interface ImageGalleryContent {
  headline?: string;
  eyebrow?: string;
  images: GalleryImage[];
  mode: GalleryMode;
  tiled_layout: TiledLayout;
  show_captions: boolean;
  background_color: "black" | "blue";
}

export type SlideContent =
  | CoverContent
  | SectionDividerContent
  | StatsContent
  | TextImageContent
  | FullBleedImageContent
  | ContentListContent
  | QuoteContent
  | TimelineContent
  | ThankYouContent
  | TableContent
  | ChartContent
  | VideoContent
  | ImageGalleryContent;

export interface Slide {
  id: string;
  deck_id: string;
  position: number;
  layout_type: LayoutType;
  content: SlideContent;
  created_at: string;
  updated_at: string;
}

/* ── Typed helpers ── */

export function isCoverContent(c: SlideContent): c is CoverContent {
  return "eyebrow" in c && "show_logo" in c;
}
export function isStatsContent(c: SlideContent): c is StatsContent {
  return "stats" in c;
}
export function isTextImageContent(c: SlideContent): c is TextImageContent {
  return "image_side" in c;
}
export function isFullBleedImageContent(c: SlideContent): c is FullBleedImageContent {
  return "overlay_opacity" in c;
}
export function isContentListContent(c: SlideContent): c is ContentListContent {
  return "items" in c && "show_numbers" in c;
}
export function isQuoteContent(c: SlideContent): c is QuoteContent {
  return "quote_text" in c;
}
export function isTimelineContent(c: SlideContent): c is TimelineContent {
  return "events" in c;
}
export function isSectionDividerContent(c: SlideContent): c is SectionDividerContent {
  return "section_number" in c;
}
export function isThankYouContent(c: SlideContent): c is ThankYouContent {
  return "contact_email" in c || ("headline" in c && "website" in c);
}
export function isTableContent(c: SlideContent): c is TableContent {
  return "columns" in c && "rows" in c;
}
export function isChartContent(c: SlideContent): c is ChartContent {
  return "chart_type" in c;
}
export function isVideoContent(c: SlideContent): c is VideoContent {
  return "video_url" in c;
}
export function isImageGalleryContent(c: SlideContent): c is ImageGalleryContent {
  return "images" in c && "mode" in c;
}
