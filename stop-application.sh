#!/bin/bash

set -e

echo "Stopping Docker Compose services..."
docker compose down

echo ""
echo "✓ Services stopped successfully!"
