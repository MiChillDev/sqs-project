#!/bin/bash

set -e

echo "Stopping Docker Compose services..."
docker compose down --remove-orphans

echo ""
echo "✓ Services stopped successfully!"
