-- Migration: Allow NULL values in icon column for core_values table
-- This allows using icon IDs or leaving icons empty to use default SVG icons

ALTER TABLE core_values 
ALTER COLUMN icon DROP NOT NULL;

-- Update existing NULL or empty icons to empty string if needed
UPDATE core_values 
SET icon = '' 
WHERE icon IS NULL;

