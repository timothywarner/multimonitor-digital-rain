#!/bin/bash
cd "$(dirname "$0")"

# Check if Node.js is installed
if ! command -v node >/dev/null 2>&1; then
    echo "Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm >/dev/null 2>&1; then
    echo "npm is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the Matrix effect
npx electron . 