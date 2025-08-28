# Replit.md

## Overview

Stimuli is a modern web application designed for neurodivergent minds to train their senses and cognitive abilities through gamified brain training exercises. The app features a full-stack architecture with React frontend, Express backend, PostgreSQL database, and implements comprehensive user authentication, progress tracking, and achievement systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack React Query for server state
- **Navigation**: Custom tab-based navigation system
- **Animations**: Framer Motion for smooth transitions and interactions

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

### Database Architecture
- **Database**: PostgreSQL (via Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Defined in TypeScript with Zod validation
- **Migration**: Drizzle Kit for database migrations

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions
- **User Management**: Automatic user creation and profile management
- **Security**: HTTP-only cookies with secure session handling

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

## Data Flow

1. **User Authentication**: Users authenticate via Replit Auth, creating or updating user profiles
2. **Game Sessions**: Users play games, with progress automatically tracked and stored
3. **Progress Calculation**: XP, levels, and streaks are calculated and updated in real-time
4. **Achievement Checking**: New achievements are evaluated and unlocked after each session
5. **Data Visualization**: Progress data is transformed and displayed in charts and visual components

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

## Recent Changes (January 28, 2025)

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

### Critical Bug Fixes (Latest Update)
- **Money Reset Bug**: Fixed purchase system where user coins reset to zero after buying items by removing double coin deduction
- **Game Matching Logic**: Fixed Color Echo and Shape Sequence games where correct answers registered as incorrect
- **Game Timing**: Improved sequence display timing in both games (1500ms intervals instead of 1000-1200ms)
- **Sequence Length**: Reduced maximum sequence length for better accessibility (ColorEcho: 6, ShapeSequence: 5)
- **Achievement Rewards**: Added 20-coin rewards for each achievement unlock with proper notifications and sound effects
- **Store Card Consistency**: Standardized all store item cards with uniform heights and aligned content layout
- **Sound Feedback**: Added proper audio feedback for correct/incorrect answers in all games with visual notifications