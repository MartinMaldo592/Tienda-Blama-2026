    -- Create indexes for products table to improve search performance

    -- Index for category filtering (used in almost every query)
    CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos(categoria_id);

    -- Index for searching products by name (ilike)
    -- using gin_trgm_ops for fast text search would be better but standard btree helps with prefix search
    CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);

    -- Index for price filtering (min/max price)
    CREATE INDEX IF NOT EXISTS idx_productos_precio ON productos(precio);

    -- Index for stock filtering (in stock vs out of stock)
    CREATE INDEX IF NOT EXISTS idx_productos_stock ON productos(stock);

    -- Index for sorting by creation date (newest)
    CREATE INDEX IF NOT EXISTS idx_productos_created_at ON productos(created_at DESC);

    -- Composite index for common combination: category + stock (for listing active products in a category)
    CREATE INDEX IF NOT EXISTS idx_productos_cat_stock ON productos(categoria_id, stock);
