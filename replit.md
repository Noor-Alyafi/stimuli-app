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

## Recent Changes (January 17, 2025)

### Tree Design Finalization
- **Implemented "Cute" Tree Style Only**: User selected the cute cartoon tree design and requested removal of all other options
- **Fixed Flower Positioning**: Flowers now properly positioned ON tree branches instead of floating in air
- **Unified Tree Design**: All trees (Growth Tree, Garden trees, store buttons) now use the same cute cartoon style
- **Removed Tree Style Options**: Deleted CartoonTreeExamples component and style comparison interface per user request
- **Enhanced Growth Tree**: Main tree on Home page now uses cute design with proper sizing (not "green gumball" appearance)

### Gardening System Improvements  
- **Watering Mechanics**: Trees require watering every 2 days or they start dying
- **Health Indicators**: Visual status (Healthy 💚, Thirsty 💛, Dying 💔, Ready for First Watering 💧)
- **Achievement System**: Added gardening-specific achievements (First Sprout, Green Thumb, Forest Keeper, Caring Gardener)
- **Tree Growth Stages**: 5-stage progression with proper visual evolution and flower placement