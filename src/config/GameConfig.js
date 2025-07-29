export const GAME_CONFIG = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 450,
  height: 800,
  backgroundColor: '#222222',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 450,
    height: 800
  },
  input: {
    activePointers: 3
  }
};

export const GAME_SETTINGS = {
  TILE_SIZE: 50,
  PLAYER_SPEED: 500,
  SWIPE_THRESHOLD: 30,
  SWIPE_TIME_THRESHOLD: 300,
  PARTICLE_LIFETIME: 500,
  SAVE_KEY: 'swipeAndSorcerySave'
};