-- Migration: Add logo column to header table
-- Run this in your Supabase SQL Editor if the header table already exists

ALTER TABLE header 
ADD COLUMN IF NOT EXISTS logo TEXT;

-- Update existing rows to have null logo (optional)
-- UPDATE header SET logo = NULL WHERE logo IS NULL;





