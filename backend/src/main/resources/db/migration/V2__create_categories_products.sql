CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id   UUID REFERENCES categories(id),
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url   TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

CREATE TABLE products (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id      UUID REFERENCES categories(id),
    name             VARCHAR(500) NOT NULL,
    slug             VARCHAR(500) NOT NULL UNIQUE,
    description      TEXT,
    short_description VARCHAR(500),
    sku              VARCHAR(100) UNIQUE,
    brand            VARCHAR(200),
    status           VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    is_featured      BOOLEAN NOT NULL DEFAULT false,
    meta_title       VARCHAR(300),
    meta_description VARCHAR(500),
    tags             TEXT[],
    weight_grams     INTEGER,
    base_price       NUMERIC(12,2) NOT NULL DEFAULT 0,
    compare_price    NUMERIC(12,2),
    stock            INTEGER NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by       UUID REFERENCES users(id)
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_tags ON products USING gin(tags);

ALTER TABLE products ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
        setweight(to_tsvector('spanish', coalesce(name, '')), 'A') ||
        setweight(to_tsvector('spanish', coalesce(description, '')), 'B') ||
        setweight(to_tsvector('spanish', coalesce(brand, '')), 'C')
    ) STORED;

CREATE INDEX idx_products_search ON products USING gin(search_vector);

CREATE TABLE product_images (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url        TEXT NOT NULL,
    alt_text   VARCHAR(255),
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
