"use client";

import { CoverForm } from "@/components/content-forms/CoverForm";
import { SectionDividerForm } from "@/components/content-forms/SectionDividerForm";
import { StatsForm } from "@/components/content-forms/StatsForm";
import { TextImageForm } from "@/components/content-forms/TextImageForm";
import { FullBleedImageForm } from "@/components/content-forms/FullBleedImageForm";
import { ContentListForm } from "@/components/content-forms/ContentListForm";
import { QuoteForm } from "@/components/content-forms/QuoteForm";
import { TimelineForm } from "@/components/content-forms/TimelineForm";
import { ThankYouForm } from "@/components/content-forms/ThankYouForm";
import { TableForm } from "@/components/content-forms/TableForm";
import { ChartForm } from "@/components/content-forms/ChartForm";
import { VideoForm } from "@/components/content-forms/VideoForm";
import { ImageGalleryForm } from "@/components/content-forms/ImageGalleryForm";
import { HeroImpactForm } from "@/components/content-forms/HeroImpactForm";
import { BigNumberForm } from "@/components/content-forms/BigNumberForm";
import { IconGridForm } from "@/components/content-forms/IconGridForm";
import { ComparisonForm } from "@/components/content-forms/ComparisonForm";
import { TeamForm } from "@/components/content-forms/TeamForm";
import { PinterestInspoForm } from "@/components/content-forms/PinterestInspoForm";
import { LAYOUT_TYPE_LABELS } from "@/types/slide";
import type { Slide, SlideContent } from "@/types/slide";
import type {
  CoverContent, SectionDividerContent, StatsContent, TextImageContent,
  FullBleedImageContent, ContentListContent, QuoteContent, TimelineContent, ThankYouContent,
  TableContent, ChartContent, VideoContent, ImageGalleryContent,
  HeroImpactContent, BigNumberContent, IconGridContent, ComparisonContent, TeamContent,
  PinterestInspoContent,
} from "@/types/slide";

interface ContentPanelProps {
  slide: Slide;
  onUpdate: (slideId: string, content: Partial<SlideContent>) => void;
  onUploadImage: (file: File, slideId: string) => Promise<string>;
}

export function ContentPanel({ slide, onUpdate, onUploadImage }: ContentPanelProps) {
  const { layout_type, content } = slide;
  const update = (partial: Partial<SlideContent>) => onUpdate(slide.id, partial);
  const uploader = (file: File) => onUploadImage(file, slide.id);

  return (
    <div
      style={{
        width: 320,
        borderLeft: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: "#0D0D0D",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ width: 8, height: 8, backgroundColor: "#2D2DFF" }} />
        <span
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#FFFFFF",
          }}
        >
          {LAYOUT_TYPE_LABELS[layout_type]}
        </span>
      </div>

      {/* Scrollable form area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {layout_type === "cover" && (
          <CoverForm content={content as CoverContent} onChange={update} />
        )}
        {layout_type === "section_divider" && (
          <SectionDividerForm content={content as SectionDividerContent} onChange={update} />
        )}
        {layout_type === "stats" && (
          <StatsForm content={content as StatsContent} onChange={update} />
        )}
        {layout_type === "text_image" && (
          <TextImageForm content={content as TextImageContent} onChange={update} onUploadImage={uploader} />
        )}
        {layout_type === "full_bleed_image" && (
          <FullBleedImageForm content={content as FullBleedImageContent} onChange={update} onUploadImage={uploader} />
        )}
        {layout_type === "content_list" && (
          <ContentListForm content={content as ContentListContent} onChange={update} />
        )}
        {layout_type === "quote" && (
          <QuoteForm content={content as QuoteContent} onChange={update} />
        )}
        {layout_type === "timeline" && (
          <TimelineForm content={content as TimelineContent} onChange={update} />
        )}
        {layout_type === "thank_you" && (
          <ThankYouForm content={content as ThankYouContent} onChange={update} />
        )}
        {layout_type === "table" && (
          <TableForm content={content as TableContent} onChange={update} />
        )}
        {layout_type === "chart" && (
          <ChartForm content={content as ChartContent} onChange={update} />
        )}
        {layout_type === "video" && (
          <VideoForm content={content as VideoContent} onChange={update} />
        )}
        {layout_type === "image_gallery" && (
          <ImageGalleryForm
            content={content as ImageGalleryContent}
            onChange={update}
            onUploadImage={uploader}
          />
        )}
        {layout_type === "hero_impact" && (
          <HeroImpactForm content={content as HeroImpactContent} onChange={update} onUploadImage={uploader} />
        )}
        {layout_type === "big_number" && (
          <BigNumberForm content={content as BigNumberContent} onChange={update} onUploadImage={uploader} />
        )}
        {layout_type === "icon_grid" && (
          <IconGridForm content={content as IconGridContent} onChange={update} />
        )}
        {layout_type === "comparison" && (
          <ComparisonForm content={content as ComparisonContent} onChange={update} onUploadImage={uploader} />
        )}
        {layout_type === "team" && (
          <TeamForm content={content as TeamContent} onChange={update} onUploadImage={uploader} />
        )}
        {layout_type === "pinterest_inspo" && (
          <PinterestInspoForm content={content as PinterestInspoContent} onChange={update} />
        )}
      </div>
    </div>
  );
}
