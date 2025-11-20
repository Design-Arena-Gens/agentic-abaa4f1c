#!/bin/bash
set -e

# Check if VERCEL_TOKEN is set
if [ -z "$VERCEL_TOKEN" ]; then
    echo "Error: VERCEL_TOKEN environment variable is not set"
    exit 1
fi

echo "Deploying to Vercel..."
npx vercel --prod --yes --token "$VERCEL_TOKEN" --confirm

echo "Deployment complete!"
