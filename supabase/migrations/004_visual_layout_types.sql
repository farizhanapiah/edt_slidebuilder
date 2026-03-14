-- EDT SlideBuilder — Add visual-first layout types
-- Run this in your Supabase SQL Editor

ALTER TYPE layout_type ADD VALUE IF NOT EXISTS 'hero_impact';
ALTER TYPE layout_type ADD VALUE IF NOT EXISTS 'big_number';
ALTER TYPE layout_type ADD VALUE IF NOT EXISTS 'icon_grid';
ALTER TYPE layout_type ADD VALUE IF NOT EXISTS 'comparison';
ALTER TYPE layout_type ADD VALUE IF NOT EXISTS 'team';
