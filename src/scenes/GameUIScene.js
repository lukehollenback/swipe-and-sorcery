import Phaser from 'phaser';

export default class GameUIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameUIScene' });
  }

  init(data) {
    this.player = data.player;
  }

  create() {
    const { width } = this.cameras.main;
    
    // Create UI background
    const uiBackground = this.add.graphics();
    uiBackground.fillStyle(0x000000, 0.7);
    uiBackground.fillRect(0, 0, width, 80);
    
    // Health bar
    this.createHealthBar();
    
    // Coins display
    this.coinsText = this.add.text(width - 20, 20, 'Coins: 0', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#f1c40f',
      stroke: '#000000',
      strokeThickness: 2
    });
    this.coinsText.setOrigin(1, 0);
    
    // Controls hint
    this.add.text(width / 2, 60, 'Swipe to move', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#ffffff',
      alpha: 0.7
    }).setOrigin(0.5);
    
    // Listen for player events
    if (this.player && this.player.scene) {
      this.player.scene.events.on('playerDeath', this.onPlayerDeath, this);
    }
  }

  createHealthBar() {
    const barWidth = 200;
    const barHeight = 20;
    const x = 20;
    const y = 20;
    
    // Background
    this.healthBarBg = this.add.graphics();
    this.healthBarBg.fillStyle(0x000000, 0.8);
    this.healthBarBg.fillRect(x, y, barWidth, barHeight);
    
    // Health fill
    this.healthBar = this.add.graphics();
    this.updateHealthBar();
    
    // Health text
    this.healthText = this.add.text(x + barWidth / 2, y + barHeight / 2, '', {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });
    this.healthText.setOrigin(0.5);
  }

  updateHealthBar() {
    if (!this.player) return;
    
    const barWidth = 200;
    const barHeight = 20;
    const x = 20;
    const y = 20;
    
    const healthPercent = this.player.stats.health / this.player.stats.maxHealth;
    const fillWidth = barWidth * healthPercent;
    
    this.healthBar.clear();
    
    // Choose color based on health
    let color = 0x00ff00; // Green
    if (healthPercent < 0.3) {
      color = 0xff0000; // Red
    } else if (healthPercent < 0.6) {
      color = 0xffaa00; // Orange
    }
    
    this.healthBar.fillStyle(color, 1);
    this.healthBar.fillRect(x, y, fillWidth, barHeight);
    
    // Update text
    this.healthText.setText(`${this.player.stats.health}/${this.player.stats.maxHealth}`);
  }

  update() {
    if (!this.player) return;
    
    // Update UI elements
    this.updateHealthBar();
    this.coinsText.setText(`Coins: ${this.player.stats.coins}`);
  }

  onPlayerDeath() {
    // Show game over screen
    const { width, height } = this.cameras.main;
    
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    
    const gameOverText = this.add.text(width / 2, height / 2 - 50, 'GAME OVER', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 4
    });
    gameOverText.setOrigin(0.5);
    
    const coinsText = this.add.text(width / 2, height / 2 + 20, `Coins collected: ${this.player.stats.coins}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#f1c40f'
    });
    coinsText.setOrigin(0.5);
    
    const restartButton = this.add.text(width / 2, height / 2 + 80, 'TAP TO CONTINUE', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#2ecc71',
      padding: { x: 20, y: 10 }
    });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });
    
    restartButton.on('pointerdown', () => {
      this.scene.stop('DungeonScene');
      this.scene.stop('GameUIScene');
      this.scene.start('TownScene', { coins: this.player.stats.coins });
    });
  }
}