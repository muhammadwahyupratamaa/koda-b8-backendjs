ALTER TABLE orders
ADD COLUMN shipping_address JSONB,
ADD COLUMN payment_method VARCHAR(50);