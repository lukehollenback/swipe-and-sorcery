# Swipe & Sorcery

A fast-paced fantasy roguelike game built with Phaser.js featuring swipe-based movement and
persistent meta-progression.

## Play the Game

- **Production**: [Play Swipe & Sorcery](https://swipe-and-sorcery.vercel.app/)
- **PR Previews**: Each pull request automatically gets its own preview URL via Vercel

## Features

- **Swipe-Based Movement**: Intuitive swipe controls for rapid dungeon navigation
- **Procedural Dungeons**: Randomly generated levels for endless replayability
- **Fantasy Town Hub**: Persistent town with shops and upgrades
- **Item Collection**: Collect coins and treasures during dungeon runs
- **Mobile-First Design**: Optimized for portrait orientation and touch controls
- **Particle Effects**: Dynamic visual feedback for all actions

## How to Play

1. **Swipe** in any direction to move your character
2. **Collect** coins and treasures in the dungeon
3. **Avoid** enemies and hazards
4. **Reach** the portal to complete the dungeon
5. **Upgrade** your equipment in town with collected coins

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm

### Deployment

The game is configured for **Vercel** deployment:

1. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import this repository
   - Click "Deploy"

2. **Automatic Features**:
   - Production deployment from main branch
   - Automatic PR preview URLs
   - Optimized build configuration via `vercel.json`

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/swipe-and-sorcery.git
cd swipe-and-sorcery
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

### Project Structure

```
swipe-and-sorcery/
├── src/
│   ├── scenes/       # Game scenes (menu, town, dungeon)
│   ├── entities/     # Game objects (player, enemies)
│   ├── systems/      # Core systems (movement, generation)
│   ├── config/       # Game configuration
│   └── index.js      # Entry point
├── assets/           # Game assets
├── dist/            # Build output
└── package.json
```

## Technologies Used

- **Phaser.js**: HTML5 game framework
- **Webpack**: Module bundler
- **JavaScript ES6+**: Modern JavaScript features

## Future Enhancements

- Additional dungeon themes and environments
- More enemy types with unique behaviors
- Expanded item system with rare legendary items
- Boss battles and special challenge rooms
- Online leaderboards and achievements
- Sound effects and background music

## License

This project is licensed under the MIT License.