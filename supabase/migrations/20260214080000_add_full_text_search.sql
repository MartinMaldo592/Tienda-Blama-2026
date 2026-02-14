-- Enable Full Text Search (FTS) for products
-- This allows for smarter searches (ignoring accents, simple plurals, etc.) and faster performance on large datasets.

-- 1. Add 'fts' column which is auto-generated from name, description, and materials
-- We give 'A' weight to name (most important), 'B' to description, and 'C' to materials.
ALTER TABLE productos 
ADD COLUMN IF NOT EXISTS fts tsvector 
GENERATED ALWAYS AS (
  setweight(to_tsvector('spanish', coalesce(nombre, '')), 'A') || 
  setweight(to_tsvector('spanish', coalesce(descripcion, '')), 'B') ||
  setweight(to_tsvector('spanish', coalesce(materiales, '')), 'C')
) STORED;

-- 2. Create a GIN index on the new column for very fast searching
CREATE INDEX IF NOT EXISTS idx_productos_fts ON productos USING GIN (fts);
