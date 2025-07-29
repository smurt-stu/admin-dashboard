#!/bin/bash

# Vercel Build Script
echo "🚀 Starting Vercel build process..."

# Check Node.js version
echo "📋 Checking Node.js version..."
node --version
npm --version

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run type check
echo "🔍 Running TypeScript type check..."
npm run type-check

# Build the application
echo "🏗️ Building the application..."
npm run build

# Check build output
echo "✅ Build completed successfully!"
echo "📊 Build statistics:"
du -sh .next/

echo "🎉 Vercel build process completed!" 