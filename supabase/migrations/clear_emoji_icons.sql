-- Migration: Clear emoji icons from core_values table
-- This allows the landing page to use the new SVG icons based on title

UPDATE core_values 
SET icon = NULL 
WHERE icon IS NOT NULL 
  AND icon NOT LIKE 'data:image%'
  AND icon != '';

-- Verify the update
SELECT id, title, icon FROM core_values ORDER BY "order";

