import Phaser from 'phaser';
import { GAME_CONFIG } from './config/GameConfig';
import BootScene from './scenes/BootScene';
import MainMenuScene from './scenes/MainMenuScene';
import TownScene from './scenes/TownScene';
import DungeonScene from './scenes/DungeonScene';
import GameUIScene from './scenes/GameUIScene';

// Scene configuration
GAME_CONFIG.scene = [
  BootScene,
  MainMenuScene,
  TownScene,
  DungeonScene,
  GameUIScene
];

// Create game instance
window.addEventListener('load', () => {
  const game = new Phaser.Game(GAME_CONFIG);
  
  // Prevent context menu on right click
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
  
  // Handle resize
  window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
  });
});