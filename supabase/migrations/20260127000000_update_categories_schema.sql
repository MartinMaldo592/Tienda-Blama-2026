
-- Add parent_id to categoras table for hierarchy
ALTER TABLE categorias 
ADD COLUMN IF NOT EXISTS parent_id BIGINT REFERENCES categorias(id);

-- Optional: Index on parent_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_categorias_parent_id ON categorias(parent_id);
