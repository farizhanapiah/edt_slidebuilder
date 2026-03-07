-- EDT SlideBuilder — Add new layout types
-- Run this in your Supabase SQL Editor

ALTER TYPE layout_type ADD VALUE IF NOT EXISTS 'table';
ALTER TYPE layout_type ADD VALUE IF NOT EXISTS 'chart';
ALTER TYPE layout_type ADD VALUE IF NOT EXISTS 'video';
ALTER TYPE layout_type ADD VALUE IF NOT EXISTS 'image_gallery';
