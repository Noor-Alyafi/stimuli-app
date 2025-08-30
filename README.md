# Stimuli - Sensory Training for Neurodivergent Minds

A professional sensory training application designed to support neurodivergent users through an engaging, interactive tree growth metaphor. Train your cognitive abilities through gamified brain training exercises with beautiful visualization.

## 🌟 Features

### Cognitive Training Games
- **Color Echo**: Match colors to sounds and strengthen cross-sensory connections
- **Shape Sequence**: Remember and reproduce complex visual patterns
- **Spotlight**: Find the odd one out and improve focused attention
- **Synesthetic Recall**: Connect words with colors to enhance semantic memory
- **Memory Matrix**: Remember and manipulate information in your mind
- **Quick Response**: Train rapid decision-making and reaction time
- **Reaction Time**: Improve processing speed and quick responses
- **Number Sequence**: Remember and recall number patterns
- **Pattern Recognition**: Identify complex visual patterns

### Gamification Elements
- **XP System**: Earn experience points for completing games
- **Level Progression**: Advance through levels with tree growth visualization
- **Achievement System**: Unlock badges and earn coin rewards
- **Coin Economy**: Purchase tree seeds, decorations, and boosters
- **Growth Trees**: Watch your progress grow into beautiful trees

### Progress Tracking
- **Personal Dashboard**: Track your cognitive development
- **Journal System**: Record mood, focus, and energy levels
- **Statistics**: View detailed progress charts and analytics
- **Achievement Gallery**: Display your earned badges and milestones

## 🚀 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI with shadcn/ui
- **Animations**: Framer Motion
- **Data Storage**: Browser localStorage (no backend required)
- **Build Tool**: Vite
- **Deployment**: GitHub Pages compatible

## 📱 Static Deployment

This application runs entirely in the browser with no backend dependencies:

- **Client-side Authentication**: Secure login/registration with password hashing
- **Local Data Storage**: All progress saved in browser localStorage
- **Offline Capable**: Works without internet after initial load
- **Cross-Platform**: Runs on desktop and mobile browsers

## 🛠 Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd stimuli

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
# Build static files for deployment
npm run build
```

## 🌐 Deployment

### GitHub Pages
1. Update `base` path in `vite.config.static.ts` to match your repository name
2. Build the application: `npm run build`
3. Deploy the `dist` folder to GitHub Pages

See [GITHUB_PAGES_DEPLOYMENT.md](GITHUB_PAGES_DEPLOYMENT.md) for detailed instructions.

### Other Static Hosts
The built application in the `dist` folder can be deployed to any static hosting service:
- Netlify
- Vercel
- Firebase Hosting
- AWS S3 + CloudFront

## 🎮 Game Mechanics

### XP and Leveling
- **Levels 1-9**: Progress every 200 XP
- **Level 10**: Reached at exactly 2000 XP (tree completion)
- **Level 11+**: Continue with 300 XP per level
- **Tree Growth**: Trees advance through 5 growth stages based on XP

### Coin System
- Earn coins by completing games (2-8 coins based on performance)
- Achievement unlocks award 20 coins
- Spend coins on seeds, decorations, and boosters

### Achievements
- Multiple categories: XP milestones, game-specific, and special achievements
- Each achievement unlock provides coin rewards
- Visual badge collection system

## 🎨 Customization

### Store Items
Modify store items in `client/src/lib/localStorage.ts`:
- Tree seeds (Cherry Blossom, Rainbow Eucalyptus)
- Decorations (Fairy Lights, Garden Gnomes)
- Boosters (Growth enhancers, XP multipliers)

### Game Difficulty
Adjust game parameters in individual game components:
- Sequence lengths
- Time limits
- Scoring mechanisms

### Visual Themes
Customize the design system in `client/src/index.css`:
- Color palette
- Typography
- Component styling

## 🧠 Neurodivergent-Friendly Design

- **Clear Visual Hierarchy**: Consistent navigation and layout
- **Progress Visualization**: Immediate feedback and achievement recognition
- **Customizable Difficulty**: Adaptive challenge levels
- **Sensory Integration**: Games designed for cross-sensory training
- **Positive Reinforcement**: Achievement system with visual rewards

## 📊 Data Management

### User Data Structure
- User profiles with authentication
- Game progress and statistics
- Achievement tracking
- Tree growth and decorations
- Journal entries and mood tracking
- Coin transactions and inventory

### Data Persistence
All data is stored in browser localStorage with structured JSON objects. No external database required.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check the browser console for errors
2. Ensure localStorage is enabled
3. Clear browser cache if necessary
4. Create an issue on GitHub with details

## 🌱 Future Enhancements

- Data export/import functionality
- Additional cognitive training games
- Social features (with privacy controls)
- Advanced analytics and insights
- Progressive Web App (PWA) features
- Accessibility improvements

---

Made with 💜 for neurodivergent minds everywhere.