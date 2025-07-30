import Phaser from 'phaser';

// Basic game configuration
const config = {
  type: Phaser.AUTO,
  width: 450,
  height: 800,
  parent: 'game-container',
  backgroundColor: '#2c3e50',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload: preload,
    create: create
  }
};

// Preload function
function preload() {
  // Create a simple colored square as a placeholder
  this.add.graphics()
    .fillStyle(0x3498db)
    .fillRect(0, 0, 50, 50)
    .generateTexture('player', 50, 50)
    .destroy();
}

// Create function  
function create() {
  // Simple welcome message
  this.add.text(225, 300, 'Swipe & Sorcery', {
    fontSize: '32px',
    fill: '#ffffff',
    fontFamily: 'Arial'
  }).setOrigin(0.5);
  
  this.add.text(225, 350, 'Game Starting...', {
    fontSize: '18px', 
    fill: '#ecf0f1',
    fontFamily: 'Arial'
  }).setOrigin(0.5);
  
  // Create a simple player sprite
  const player = this.add.image(225, 500, 'player');
  
  // Simple animation
  this.tweens.add({
    targets: player,
    y: 480,
    duration: 1000,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });
  
  console.log('Basic Phaser game initialized successfully!');
}

// Initialize the game
const game = new Phaser.Game(config);

// Disable context menu on mobile
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
});