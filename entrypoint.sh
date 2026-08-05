#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."

until nc -z "$DB_HOST" "$DB_PORT"
do
    sleep 1
done

echo "Running database migrations..."

migrate \
    -path /app/migrations \
    -database "postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable" \
    up

echo "Starting application..."

exec "$@"