# Replit.md

## Overview

Stimuli is a modern web application designed for neurodivergent minds to train their senses and cognitive abilities through gamified brain training exercises. The app features a full-stack architecture with React frontend, Express backend, PostgreSQL database, and implements comprehensive user authentication, progress tracking, and achievement systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture (Static Deployment)
- **Framework**: React 18 with TypeScript (static build)
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Custom static data hooks with localStorage persistence
- **Navigation**: Custom tab-based navigation system
- **Animations**: Framer Motion for smooth transitions and interactions
- **Data Storage**: Browser localStorage for all user data and game progress
- **Authentication**: Client-side authentication with password hashing and session management

### Data Persistence Architecture
- **Storage**: Browser localStorage for all application data
- **Data Structure**: Structured JSON objects for users, game progress, achievements, and transactions
- **Authentication**: Static authentication service with password hashing
- **Session Management**: localStorage-based user sessions
- **Data Validation**: TypeScript interfaces for type safety

## Key Components

### Authentication System (Static)
- **Provider**: Custom static authentication service
- **Session Storage**: localStorage-based sessions
- **User Management**: Client-side user registration and login
- **Security**: Password hashing and localStorage-based session management
- **Registration**: Email and username validation with duplicate prevention

### Game Progress Tracking
- **Progress Logging**: Individual game session tracking with scores and timing
- **XP System**: Experience points awarded for game completion
- **Streak Tracking**: Daily engagement streak calculation
- **Skill Development**: Multiple skill categories with individual progress

### Achievement System
- **Badge System**: Unlockable achievements with different categories
- **Progress Rewards**: XP rewards for milestone achievements
- **Visual Feedback**: Custom icons and animations for achievements

### User Interface
- **Design System**: Custom Tailwind configuration with neurodivergent-friendly colors
- **Component Library**: Comprehensive UI components based on Radix UI
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Elements**: Growth tree visualization, progress charts, and animated feedback

## Data Flow (Static)

1. **User Authentication**: Users register/login via client-side authentication stored in localStorage
2. **Game Sessions**: Users play games, with progress automatically tracked and stored in localStorage
3. **Progress Calculation**: XP, levels, and streaks are calculated and updated in real-time using static data hooks
4. **Achievement Checking**: New achievements are evaluated and unlocked after each session with coin rewards
5. **Data Visualization**: Progress data is transformed from localStorage and displayed in charts and visual components
6. **Data Persistence**: All user data persists in browser localStorage across sessions

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Query, React Hook Form
- **UI Components**: Radix UI suite for accessible components
- **Styling**: Tailwind CSS, Framer Motion for animations
- **Database**: Neon PostgreSQL, Drizzle ORM
- **Authentication**: Replit Auth, Passport.js

### Development Tools
- **Build System**: Vite for fast development and optimized builds
- **TypeScript**: Full type safety across frontend and backend
- **Code Quality**: ESLint, Prettier (implied by project structure)

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles Node.js server code
- **Database**: Drizzle migrations handle schema updates

### Environment Configuration
- **Development**: Hot reloading with Vite dev server
- **Production**: Compiled assets served by Express with static file serving
- **Database**: Environment-based connection strings for different deployment stages

### Hosting Requirements
- **Runtime**: Node.js environment with ES module support
- **Database**: PostgreSQL-compatible database (Neon serverless)
- **Storage**: Session storage in PostgreSQL
- **Environment Variables**: Database URL, session secrets, OAuth configuration

The application is designed to be a comprehensive brain training platform with professional-grade user experience, robust data tracking, and engaging gamification elements specifically tailored for neurodivergent users.

## Recent Changes (August 30, 2025)

### Growth Tree Level System Restructure
- **Level Progression**: Levels 1-9 progress every 200 XP, level 10 reached at exactly 2000 XP
- **Level Reset System**: After reaching level 10 (2000 XP), users continue to level 11+ with 300 XP per level
- **Tree Master Achievement**: Added special achievement for reaching level 10 with automatic progression
- **Enhanced XP Notifications**: Advanced UI showing specific earned XP amounts with improved styling
- **Level 8 Visual Fix**: Level 8 trees now appear like level 7 trees but continue growth progression

### Decoration System Enhancement
- **Fairy Lights**: Large colorful teardrop-shaped bulbs on horizontal black wire strings across trees
- **Garden Gnomes**: Cute whimsical gnomes with colorful oversized hats and beards placed at tree base
- **Multi-Stage Support**: Decorations now available on growth stages 3, 4, and 5 with appropriate sizing
- **Visual Consistency**: Gnome hat colors vary by tree stage (green, blue, pink) for visual variety
- **Proper Positioning**: Gnomes positioned on ground near tree base, lights strung horizontally across branches
- **Equal Distance Positioning**: Fixed gnome placement to use equal distance around tree center for uniform spacing

### Game System Improvements
- **Enhanced XP Rewards**: Base 15 XP + bonus XP based on performance scores
- **Synesthetic Recall Fix**: Color consistency now uses exact colors from display phase
- **Store Cleanup**: Removed duplicate "Willow Tree Seed" items, kept unified "Willow Seed"
- **Notification Polish**: Removed duplicate XP notifications, streamlined reward display system

### Critical Bug Fixes (Latest Update - August 30, 2025)
- **Money Reset Bug**: Fixed purchase system where user coins reset to zero after buying items by removing double coin deduction
- **Color Echo Game Logic**: Completely rebuilt sequence matching to properly compare colors and frequencies, fixed visual highlighting during sequence display
- **Shape Sequence Game Logic**: Fixed multiple sequence generation conflicts, rebuilt timing system with sequential display to prevent overlapping sequences
- **Game Timing**: Improved sequence display timing in both games (1500ms intervals) with proper sequential logic
- **Sequence Length**: Reduced maximum sequence length for better accessibility (ColorEcho: 6, ShapeSequence: 5)
- **Achievement Rewards**: Added 20-coin rewards for each achievement unlock with proper notifications and sound effects
- **Store Card Consistency**: Standardized all store item cards with uniform heights and aligned content layout using flexbox
- **Sound Feedback**: Added proper audio feedback for correct/incorrect answers in all games with visual notifications
- **Gnome Positioning**: Enhanced decoration system with mathematical semicircle positioning for perfect centering around trees with increased spacing (100% radius)
- **Navigation Branding**: Added custom SVG brain logo to navigation header next to "Stimuli" title with gradient background

### Static Deployment Conversion (August 30, 2025)
- **Architecture Change**: Converted entire application from full-stack to static frontend-only for GitHub Pages deployment
- **Data Management**: Replaced PostgreSQL database with localStorage-based persistence
- **Authentication System**: Implemented client-side authentication using localStorage with password hashing
- **React Query Replacement**: Removed all @tanstack/react-query dependencies and replaced with custom static data hooks
- **API Layer Removal**: Eliminated all server API routes and database connections
- **Build Configuration**: Created static-specific Vite configuration optimized for GitHub Pages
- **Data Persistence**: All user progress, achievements, game sessions, and purchases now stored in browser localStorage
- **Deployment Ready**: Application now fully compatible with GitHub Pages hosting without backend requirements