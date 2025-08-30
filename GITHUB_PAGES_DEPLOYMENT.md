# GitHub Pages Deployment Guide for Stimuli

This guide explains how to deploy the Stimuli sensory training application to GitHub Pages as a static website.

## Overview

Stimuli has been converted to a fully static frontend application that:
- Stores all user data in browser localStorage
- Provides client-side authentication with password hashing
- Tracks game progress, achievements, and tree growth locally
- Requires no backend server or database

## Prerequisites

1. GitHub account
2. Git installed on your computer
3. Node.js (for building the application)

## Step-by-Step Deployment

### 1. Prepare Your Repository

1. Create a new repository on GitHub named `stimuli` (or any name you prefer)
2. Clone this project to your local machine
3. Update the repository URL in your local Git configuration

### 2. Configure for GitHub Pages

1. Open `vite.config.static.ts`
2. Update the `base` path to match your repository name:
   ```typescript
   base: '/your-repo-name/', // Replace with your actual repo name
   ```

### 3. Build the Static Application

```bash
# Install dependencies
npm install

# Build for production
npm run build --config vite.config.static.ts
```

This creates a `dist` folder containing all static files.

### 4. Deploy to GitHub Pages

#### Option A: Using GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build

    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

2. Push your code to the main branch
3. Enable GitHub Pages in your repository settings
4. Set the source to "GitHub Actions"

#### Option B: Manual Deployment

1. Build the application locally (see step 3)
2. Create a `gh-pages` branch
3. Copy the contents of the `dist` folder to the root of the `gh-pages` branch
4. Push the `gh-pages` branch to GitHub
5. Enable GitHub Pages in repository settings with `gh-pages` as the source

### 5. Configure GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Select your deployment source:
   - For GitHub Actions: Select "GitHub Actions"
   - For manual: Select "Deploy from a branch" and choose `gh-pages`

## Features in Static Deployment

### Authentication
- Users can register with email, username, and password
- Login sessions persist in localStorage
- Password hashing for basic security

### Data Persistence
- All game progress stored locally
- Achievements and rewards system
- Tree growth and decoration tracking
- Journal entries and mood tracking
- Coin transactions and store purchases

### Game Features
- All cognitive training games fully functional
- XP and leveling system
- Achievement unlocking with coin rewards
- Progress visualization and statistics

## Important Notes

### Data Portability
- User data is stored in browser localStorage
- Data is device/browser specific
- Consider implementing export/import functionality for data backup

### Browser Compatibility
- Requires modern browsers with localStorage support
- Works on desktop and mobile devices
- No Internet Explorer support

### Security Considerations
- Password hashing is basic and suitable for demo purposes
- For production use, consider more robust authentication
- All data is client-side only

## Customization

### Branding
- Update `index.html` title and meta tags
- Modify `public/manifest.json` for PWA settings
- Replace favicon and app icons in `public/` folder

### Configuration
- Modify initial coins, XP rates, and achievement requirements in `client/src/lib/localStorage.ts`
- Customize store items and prices
- Adjust tree growth mechanics and level progression

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Check Node.js version (requires Node 18+)
- Clear npm cache: `npm cache clean --force`

### Deployment Issues
- Verify the base path in `vite.config.static.ts` matches your repository name
- Check GitHub Pages settings are configured correctly
- Ensure all files are properly committed and pushed

### Runtime Issues
- Check browser console for JavaScript errors
- Verify localStorage is enabled in browser
- Clear browser cache and localStorage if needed

## Live Demo

Once deployed, your application will be available at:
`https://yourusername.github.io/your-repo-name/`

## Support

For issues with the application itself, check the browser console for errors and ensure localStorage is functioning properly.