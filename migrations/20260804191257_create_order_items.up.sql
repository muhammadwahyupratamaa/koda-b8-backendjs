CREATE TABLE "order_items" (
    "id" BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "order_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" BIGINT NOT NULL,
    "subtotal" BIGINT NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_order_item_order
        FOREIGN KEY(order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_order_item_product
        FOREIGN KEY(product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
);