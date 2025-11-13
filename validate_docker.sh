#!/bin/bash

# Test script to validate that our Docker configuration will work
# This validates the key parts without building the entire image

echo "=== Validating Docker Configuration for Plasmic Application ==="

echo ""
echo "1. Checking if our live-frame fix is in place..."
if grep -q "cssStubPlugin" /Users/xain/Documents/GitHub/plasmic-orcayo/platform/live-frame/rollup.config.js; then
    echo "✓ CSS stubbing fix is applied to live-frame/rollup.config.js"
else
    echo "✗ CSS stubbing fix is NOT applied to live-frame/rollup.config.js"
    exit 1
fi

echo ""
echo "2. Validating that Dockerfiles exist..."
if [ -f "/Users/xain/Documents/GitHub/plasmic-orcayo/production.Dockerfile" ]; then
    echo "✓ production.Dockerfile exists"
else
    echo "✗ production.Dockerfile does not exist"
    exit 1
fi

if [ -f "/Users/xain/Documents/GitHub/plasmic-orcayo/optimized.Dockerfile" ]; then
    echo "✓ optimized.Dockerfile exists"
else
    echo "✗ optimized.Dockerfile does not exist"
    exit 1
fi

echo ""
echo "3. Validating docker-compose files exist..."
if [ -f "/Users/xain/Documents/GitHub/plasmic-orcayo/docker-compose.production.yml" ]; then
    echo "✓ docker-compose.production.yml exists"
else
    echo "✗ docker-compose.production.yml does not exist"
    exit 1
fi

if [ -f "/Users/xain/Documents/GitHub/plasmic-orcayo/docker-compose.development.yml" ]; then
    echo "✓ docker-compose.development.yml exists"
else
    echo "✗ docker-compose.development.yml does not exist"
    exit 1
fi

echo ""
echo "4. Checking that the live-frame build works with our fix..."
cd /Users/xain/Documents/GitHub/plasmic-orcayo/platform/live-frame
if npm run build; then
    echo "✓ live-frame builds successfully with our CSS stubbing fix"
else
    echo "✗ live-frame build failed"
    exit 1
fi

echo ""
echo "=== Docker Configuration Validation Complete ==="
echo "All components are in place for a successful Docker deployment."
echo ""
echo "To build the production image: docker build -f production.Dockerfile -t plasmic-app:production ."
echo "To build the optimized image: docker build -f optimized.Dockerfile -t plasmic-app:optimized ."
echo "To run in production: docker-compose -f docker-compose.production.yml up -d"
echo "To run in development: docker-compose -f docker-compose.development.yml up -d"