export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
    bg.fillRect(0, 0, width, height);
    
    // Title
    const title = this.add.text(width / 2, height / 3, 'SWIPE & SORCERY', {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#f1c40f',
      stroke: '#000000',
      strokeThickness: 4
    });
    title.setOrigin(0.5);
    
    // Subtitle
    const subtitle = this.add.text(width / 2, height / 3 + 50, 'A Fast-Paced Fantasy Adventure', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ecf0f1'
    });
    subtitle.setOrigin(0.5);
    
    // Play button
    const playButton = this.createButton(width / 2, height / 2, 'Enter Town', () => {
      this.scene.start('TownScene');
    });
    
    // Dungeon button (quick play)
    const dungeonButton = this.createButton(width / 2, height / 2 + 80, 'Quick Dungeon', () => {
      this.scene.start('DungeonScene');
    });
    
    // Instructions
    const instructions = [
      'Swipe to move',
      'Collect treasures',
      'Upgrade in town',
      'Survive the dungeon!'
    ];
    
    instructions.forEach((text, index) => {
      this.add.text(width / 2, height * 0.7 + (index * 25), text, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#bdc3c7'
      }).setOrigin(0.5);
    });
    
    // Version
    this.add.text(10, height - 20, 'v1.0.0', {
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#7f8c8d'
    });
  }

  createButton(x, y, text, callback) {
    const button = this.add.rectangle(x, y, 200, 50, 0x3498db);
    const buttonText = this.add.text(x, y, text, {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff'
    });
    buttonText.setOrigin(0.5);
    
    button.setInteractive({ useHandCursor: true });
    
    button.on('pointerover', () => {
      button.setFillStyle(0x5dade2);
    });
    
    button.on('pointerout', () => {
      button.setFillStyle(0x3498db);
    });
    
    button.on('pointerdown', () => {
      button.setScale(0.95);
    });
    
    button.on('pointerup', () => {
      button.setScale(1);
      callback();
    });
    
    return button;
  }
}