export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.createLoadingScreen();
    
    // Create placeholder assets
    this.createPlaceholderAssets();
  }

  createLoadingScreen() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      font: '20px monospace',
      fill: '#ffffff'
    });
    loadingText.setOrigin(0.5, 0.5);
    
    const percentText = this.add.text(width / 2, height / 2, '0%', {
      font: '18px monospace',
      fill: '#ffffff'
    });
    percentText.setOrigin(0.5, 0.5);
    
    const assetText = this.add.text(width / 2, height / 2 + 50, '', {
      font: '18px monospace',
      fill: '#ffffff'
    });
    assetText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });
    
    this.load.on('fileprogress', (file) => {
      assetText.setText('Loading asset: ' + file.key);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }

  createPlaceholderAssets() {
    // Create colored squares as placeholder sprites
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    
    // Player sprite (blue square)
    graphics.fillStyle(0x3498db, 1);
    graphics.fillRect(0, 0, 40, 40);
    graphics.generateTexture('player', 40, 40);
    graphics.clear();
    
    // Wall tile (dark gray)
    graphics.fillStyle(0x2c3e50, 1);
    graphics.fillRect(0, 0, 50, 50);
    graphics.generateTexture('wall', 50, 50);
    graphics.clear();
    
    // Floor tile (light gray)
    graphics.fillStyle(0x7f8c8d, 1);
    graphics.fillRect(0, 0, 50, 50);
    graphics.generateTexture('floor', 50, 50);
    graphics.clear();
    
    // Coin (yellow circle)
    graphics.fillStyle(0xf1c40f, 1);
    graphics.fillCircle(15, 15, 15);
    graphics.generateTexture('coin', 30, 30);
    graphics.clear();
    
    // Enemy (red square)
    graphics.fillStyle(0xe74c3c, 1);
    graphics.fillRect(0, 0, 40, 40);
    graphics.generateTexture('enemy', 40, 40);
    graphics.clear();
    
    // Chest (brown rectangle)
    graphics.fillStyle(0x8b4513, 1);
    graphics.fillRect(0, 0, 45, 35);
    graphics.generateTexture('chest', 45, 35);
    graphics.clear();
    
    // Portal (purple circle)
    graphics.fillStyle(0x9b59b6, 1);
    graphics.fillCircle(25, 25, 25);
    graphics.generateTexture('portal', 50, 50);
    graphics.clear();
    
    // Particle (white dot)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(2, 2, 2);
    graphics.generateTexture('particle', 4, 4);
    graphics.clear();
    
    // Sword icon (light blue)
    graphics.fillStyle(0x5dade2, 1);
    graphics.fillRect(15, 0, 10, 35);
    graphics.fillRect(5, 25, 30, 8);
    graphics.generateTexture('sword', 40, 40);
    graphics.clear();
    
    // Shield icon (silver)
    graphics.fillStyle(0xbdc3c7, 1);
    graphics.fillRect(5, 5, 30, 35);
    graphics.generateTexture('shield', 40, 40);
    graphics.clear();
    
    // Potion (green)
    graphics.fillStyle(0x27ae60, 1);
    graphics.fillRect(10, 15, 20, 20);
    graphics.fillRect(15, 5, 10, 10);
    graphics.generateTexture('potion', 40, 40);
    
    graphics.destroy();
  }

  create() {
    // Initialize game systems
    console.log('BootScene complete - available textures:', Object.keys(this.textures.list));
    this.scene.start('MainMenuScene');
  }
}