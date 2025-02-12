#!/bin/bash

# Exit on error
set -e

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI is not installed. Installing..."
    brew install supabase/tap/supabase
fi

# Initialize Supabase project if not already initialized
if [ ! -f "supabase/config.toml" ]; then
    echo "Initializing Supabase project..."
    supabase init
fi

# Start Supabase services
echo "Starting Supabase services..."
supabase start

# Run migrations
echo "Running migrations..."
supabase db reset

echo "Supabase setup complete! Your local development environment is ready."
echo "Supabase Studio is available at: http://localhost:54323"
echo "API URL: http://localhost:54321"
echo "Database URL: postgresql://postgres:postgres@localhost:54322/postgres" 