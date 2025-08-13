#!/bin/bash

echo "AVIF Image Conversion Script"
echo "============================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed or not in PATH."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Installing dependencies..."
npm install

echo
echo "Starting AVIF conversion..."
node generate-avif.js

echo
echo "Conversion complete!"