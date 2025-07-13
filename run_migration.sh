#!/bin/bash

# Run migration directly using psql
echo "Running security updates migration..."

# Database connection details
DB_HOST="aws-0-us-east-2.pooler.supabase.com"
DB_PORT="6543"
DB_NAME="postgres"
DB_USER="postgres.gynvafivzdtdqojuuoit"
DB_PASS="J3lRn1mOhms5ay1c"

# Run the combined migration
PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f supabase/migrations/20250112_combined_security_updates.sql

echo "Migration completed!"