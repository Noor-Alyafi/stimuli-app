#!/bin/bash

# Script to convert Stimuli app to static deployment
echo "Converting Stimuli app to static deployment for GitHub Pages..."

# Update package.json to use static config
cp package.static.json package.json

# Update vite config
cp vite.config.static.ts vite.config.ts

# Remove all server-related dependencies from package.json
echo "Removing server dependencies..."

echo "Conversion complete! The app is now ready for static deployment on GitHub Pages."
echo "To deploy:"
echo "1. Run 'npm run build' to create static files"
echo "2. Deploy the 'dist' folder to GitHub Pages"
echo "3. Make sure to update the 'base' path in vite.config.ts to match your repo name"