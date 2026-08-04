CREATE TABLE "products"(
    "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL ,
    "brand" VARCHAR(255) NOT NULL ,
    "category_id" INTEGER,
    "price" BIGINT NOT NULL,
    "price_disc" BIGINT ,
    "discount" INTEGER DEFAULT 0,
    "rating" NUMERIC(2,1) DEFAULT 0,
    "review" INTEGER DEFAULT 0,
    "sold" INTEGER DEFAULT 0,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "is_featured" BOOLEAN DEFAULT FALSE,
    "image_url" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

SELECT * FROM "products";

INSERT INTO products
(
    name,
    brand,
    price,
    stock
)
VALUES
(
    'Running Shoes',
    'RunMax',
    699000,
    42
);