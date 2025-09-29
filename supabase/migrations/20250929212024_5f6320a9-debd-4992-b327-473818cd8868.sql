-- Add image_url column to content table
ALTER TABLE public.content
ADD COLUMN image_url text;