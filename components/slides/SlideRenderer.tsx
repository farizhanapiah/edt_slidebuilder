import type { Slide } from "@/types/slide";
import { CoverSlide } from "./CoverSlide";
import { SectionDividerSlide } from "./SectionDividerSlide";
import { StatsSlide } from "./StatsSlide";
import { TextImageSlide } from "./TextImageSlide";
import { FullBleedImageSlide } from "./FullBleedImageSlide";
import { ContentListSlide } from "./ContentListSlide";
import { QuoteSlide } from "./QuoteSlide";
import { TimelineSlide } from "./TimelineSlide";
import { ThankYouSlide } from "./ThankYouSlide";
import { TableSlide } from "./TableSlide";
import { ChartSlide } from "./ChartSlide";
import { VideoSlide } from "./VideoSlide";
import { ImageGallerySlide } from "./ImageGallerySlide";

import { HeroImpactSlide } from "./HeroImpactSlide";
import { BigNumberSlide } from "./BigNumberSlide";
import { IconGridSlide } from "./IconGridSlide";
import { ComparisonSlide } from "./ComparisonSlide";
import { TeamSlide } from "./TeamSlide";
import { PinterestInspoSlide } from "./PinterestInspoSlide";

import type {
  CoverContent,
  SectionDividerContent,
  StatsContent,
  TextImageContent,
  FullBleedImageContent,
  ContentListContent,
  QuoteContent,
  TimelineContent,
  ThankYouContent,
  TableContent,
  ChartContent,
  VideoContent,
  ImageGalleryContent,
  HeroImpactContent,
  BigNumberContent,
  IconGridContent,
  ComparisonContent,
  TeamContent,
  PinterestInspoContent,
} from "@/types/slide";

interface SlideRendererProps {
  slide: Slide;
  isExport?: boolean;
}

export function SlideRenderer({ slide, isExport }: SlideRendererProps) {
  const { layout_type, content } = slide;

  switch (layout_type) {
    case "cover":
      return <CoverSlide content={content as CoverContent} isExport={isExport} />;
    case "section_divider":
      return <SectionDividerSlide content={content as SectionDividerContent} isExport={isExport} />;
    case "stats":
      return <StatsSlide content={content as StatsContent} isExport={isExport} />;
    case "text_image":
      return <TextImageSlide content={content as TextImageContent} isExport={isExport} />;
    case "full_bleed_image":
      return <FullBleedImageSlide content={content as FullBleedImageContent} isExport={isExport} />;
    case "content_list":
      return <ContentListSlide content={content as ContentListContent} isExport={isExport} />;
    case "quote":
      return <QuoteSlide content={content as QuoteContent} isExport={isExport} />;
    case "timeline":
      return <TimelineSlide content={content as TimelineContent} isExport={isExport} />;
    case "thank_you":
      return <ThankYouSlide content={content as ThankYouContent} isExport={isExport} />;
    case "table":
      return <TableSlide content={content as TableContent} isExport={isExport} />;
    case "chart":
      return <ChartSlide content={content as ChartContent} isExport={isExport} />;
    case "video":
      return <VideoSlide content={content as VideoContent} isExport={isExport} />;
    case "image_gallery":
      return <ImageGallerySlide content={content as ImageGalleryContent} isExport={isExport} />;
    case "hero_impact":
      return <HeroImpactSlide content={content as HeroImpactContent} isExport={isExport} />;
    case "big_number":
      return <BigNumberSlide content={content as BigNumberContent} isExport={isExport} />;
    case "icon_grid":
      return <IconGridSlide content={content as IconGridContent} isExport={isExport} />;
    case "comparison":
      return <ComparisonSlide content={content as ComparisonContent} isExport={isExport} />;
    case "team":
      return <TeamSlide content={content as TeamContent} isExport={isExport} />;
    case "pinterest_inspo":
      return <PinterestInspoSlide content={content as PinterestInspoContent} isExport={isExport} />;
    default:
      return (
        <div
          style={{
            width: 1280,
            height: 720,
            backgroundColor: "#0A0A0A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#8C8C8C",
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 14,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          UNKNOWN LAYOUT TYPE
        </div>
      );
  }
}
