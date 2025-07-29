import Phaser from 'phaser';
import { GAME_SETTINGS } from '../config/GameConfig';

export default class TownScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TownScene' });
  }

  init(data) {
    this.earnedCoins = data.coins || 0;
    this.playerData = this.loadPlayerData();
    
    if (this.earnedCoins > 0) {
      this.playerData.totalCoins += this.earnedCoins;
      this.savePlayerData();
    }
  }

  create() {
    const { width, height } = this.cameras.main;
    
    // Background
    this.createBackground();
    
    // Town title
    this.add.text(width / 2, 50, 'TOWN OF SORCERY', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#f1c40f',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Display coins
    this.coinsDisplay = this.add.text(20, 20, `Coins: ${this.playerData.totalCoins}`, {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#f1c40f',
      stroke: '#000000',
      strokeThickness: 2
    });
    
    // Create town buildings
    this.createBuildings();
    
    // Create navigation buttons
    this.createNavigationButtons();
    
    // Show earned coins animation
    if (this.earnedCoins > 0) {
      this.showEarnedCoins();
    }
  }

  createBackground() {
    const { width, height } = this.cameras.main;
    
    // Sky gradient
    const sky = this.add.graphics();
    sky.fillGradientStyle(0x87ceeb, 0x87ceeb, 0x98d8e8, 0x98d8e8, 1);
    sky.fillRect(0, 0, width, height * 0.6);
    
    // Ground
    const ground = this.add.graphics();
    ground.fillStyle(0x8b7355, 1);
    ground.fillRect(0, height * 0.6, width, height * 0.4);
    
    // Add some decorative elements
    this.createClouds();
  }

  createClouds() {
    const { width } = this.cameras.main;
    
    for (let i = 0; i < 3; i++) {
      const cloud = this.add.graphics();
      cloud.fillStyle(0xffffff, 0.8);
      cloud.fillCircle(0, 0, 30);
      cloud.fillCircle(25, 0, 25);
      cloud.fillCircle(-25, 0, 25);
      cloud.fillCircle(0, -10, 20);
      
      cloud.x = Phaser.Math.Between(50, width - 50);
      cloud.y = Phaser.Math.Between(80, 150);
      
      // Slowly moving clouds
      this.tweens.add({
        targets: cloud,
        x: cloud.x + 100,
        duration: 20000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  createBuildings() {
    const { width, height } = this.cameras.main;
    const groundY = height * 0.6;
    
    // Blacksmith
    this.createBuilding(width * 0.2, groundY, 'BLACKSMITH', 0x4a4a4a, () => {
      this.openBlacksmith();
    });
    
    // Mage Tower
    this.createBuilding(width * 0.5, groundY - 30, 'MAGE TOWER', 0x6b46c1, () => {
      this.openMageTower();
    });
    
    // Tavern
    this.createBuilding(width * 0.8, groundY, 'TAVERN', 0x8b4513, () => {
      this.openTavern();
    });
  }

  createBuilding(x, y, name, color, callback) {
    const building = this.add.group();
    
    // Building base
    const base = this.add.rectangle(x, y, 100, 120, color);
    base.setOrigin(0.5, 1);
    building.add(base);
    
    // Roof
    const roof = this.add.triangle(x, y - 120, 0, 30, 50, 0, 100, 30, 0x8b0000);
    roof.setOrigin(0.5, 0);
    building.add(roof);
    
    // Door
    const door = this.add.rectangle(x, y - 30, 30, 50, 0x654321);
    door.setOrigin(0.5, 1);
    building.add(door);
    
    // Sign
    const sign = this.add.text(x, y - 140, name, {
      fontSize: '14px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 5, y: 2 }
    });
    sign.setOrigin(0.5);
    building.add(sign);
    
    // Make interactive
    base.setInteractive({ useHandCursor: true });
    base.on('pointerover', () => {
      building.getChildren().forEach(child => {
        if (child.setScale) child.setScale(1.1);
      });
    });
    
    base.on('pointerout', () => {
      building.getChildren().forEach(child => {
        if (child.setScale) child.setScale(1);
      });
    });
    
    base.on('pointerdown', callback);
  }

  createNavigationButtons() {
    const { width, height } = this.cameras.main;
    
    // Enter Dungeon button
    const dungeonButton = this.createButton(
      width / 2,
      height - 100,
      'ENTER DUNGEON',
      () => {
        this.scene.start('DungeonScene');
      }
    );
    
    // Main Menu button
    const menuButton = this.createButton(
      width / 2,
      height - 40,
      'MAIN MENU',
      () => {
        this.scene.start('MainMenuScene');
      }
    );
  }

  createButton(x, y, text, callback) {
    const button = this.add.rectangle(x, y, 200, 40, 0x2ecc71);
    const buttonText = this.add.text(x, y, text, {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 1
    });
    buttonText.setOrigin(0.5);
    
    button.setInteractive({ useHandCursor: true });
    
    button.on('pointerover', () => {
      button.setFillStyle(0x27ae60);
    });
    
    button.on('pointerout', () => {
      button.setFillStyle(0x2ecc71);
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

  openBlacksmith() {
    this.showShopDialog('BLACKSMITH', [
      { name: 'Iron Sword', cost: 50, effect: 'Damage +5' },
      { name: 'Steel Shield', cost: 75, effect: 'Defense +3' },
      { name: 'Swift Boots', cost: 100, effect: 'Speed +10%' }
    ]);
  }

  openMageTower() {
    this.showShopDialog('MAGE TOWER', [
      { name: 'Fire Spell', cost: 80, effect: 'Burn damage' },
      { name: 'Ice Shield', cost: 60, effect: 'Freeze protection' },
      { name: 'Teleport Scroll', cost: 120, effect: 'Quick escape' }
    ]);
  }

  openTavern() {
    this.showShopDialog('TAVERN', [
      { name: 'Health Potion', cost: 30, effect: 'Heal 50 HP' },
      { name: 'Stamina Brew', cost: 40, effect: 'Speed boost' },
      { name: 'Lucky Charm', cost: 150, effect: 'Double coins' }
    ]);
  }

  showShopDialog(title, items) {
    const { width, height } = this.cameras.main;
    
    // Create overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);
    overlay.setInteractive();
    
    // Dialog box
    const dialog = this.add.rectangle(width / 2, height / 2, 400, 500, 0x2c3e50);
    dialog.setStrokeStyle(3, 0xffffff);
    
    // Title
    const titleText = this.add.text(width / 2, height / 2 - 220, title, {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#f1c40f'
    });
    titleText.setOrigin(0.5);
    
    // Items
    const itemsGroup = this.add.group();
    items.forEach((item, index) => {
      const y = height / 2 - 140 + (index * 80);
      
      const itemBg = this.add.rectangle(width / 2, y, 350, 60, 0x34495e);
      itemsGroup.add(itemBg);
      
      const nameText = this.add.text(width / 2 - 160, y - 15, item.name, {
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#ffffff'
      });
      itemsGroup.add(nameText);
      
      const effectText = this.add.text(width / 2 - 160, y + 10, item.effect, {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#95a5a6'
      });
      itemsGroup.add(effectText);
      
      const costText = this.add.text(width / 2 + 100, y, `${item.cost} coins`, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#f1c40f'
      });
      costText.setOrigin(0.5);
      itemsGroup.add(costText);
      
      if (this.playerData.totalCoins >= item.cost) {
        itemBg.setInteractive({ useHandCursor: true });
        itemBg.on('pointerdown', () => {
          this.purchaseItem(item);
          this.closeShopDialog(overlay, dialog, titleText, itemsGroup, closeButton);
        });
      } else {
        itemBg.setAlpha(0.5);
      }
    });
    
    // Close button
    const closeButton = this.createButton(width / 2, height / 2 + 200, 'CLOSE', () => {
      this.closeShopDialog(overlay, dialog, titleText, itemsGroup, closeButton);
    });
  }

  closeShopDialog(...elements) {
    elements.forEach(element => {
      if (element.destroy) {
        element.destroy();
      } else if (element.clear) {
        element.clear(true, true);
      }
    });
  }

  purchaseItem(item) {
    if (this.playerData.totalCoins >= item.cost) {
      this.playerData.totalCoins -= item.cost;
      this.savePlayerData();
      this.updateCoinsDisplay();
      
      // Show purchase effect
      const purchaseText = this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        `Purchased ${item.name}!`,
        {
          fontSize: '24px',
          fontFamily: 'Arial',
          color: '#2ecc71',
          stroke: '#000000',
          strokeThickness: 2
        }
      );
      purchaseText.setOrigin(0.5);
      
      this.tweens.add({
        targets: purchaseText,
        y: purchaseText.y - 50,
        alpha: 0,
        duration: 1500,
        ease: 'Power2',
        onComplete: () => purchaseText.destroy()
      });
    }
  }

  showEarnedCoins() {
    const earnedText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 100,
      `+${this.earnedCoins} coins earned!`,
      {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#f1c40f',
        stroke: '#000000',
        strokeThickness: 3
      }
    );
    earnedText.setOrigin(0.5);
    earnedText.setScale(0);
    
    this.tweens.add({
      targets: earnedText,
      scale: 1,
      duration: 500,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.time.delayedCall(1000, () => {
          this.tweens.add({
            targets: earnedText,
            alpha: 0,
            y: earnedText.y - 50,
            duration: 1000,
            onComplete: () => earnedText.destroy()
          });
        });
      }
    });
  }

  updateCoinsDisplay() {
    this.coinsDisplay.setText(`Coins: ${this.playerData.totalCoins}`);
  }

  loadPlayerData() {
    const savedData = localStorage.getItem(GAME_SETTINGS.SAVE_KEY);
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      totalCoins: 0,
      upgrades: [],
      highScore: 0
    };
  }

  savePlayerData() {
    localStorage.setItem(GAME_SETTINGS.SAVE_KEY, JSON.stringify(this.playerData));
  }
}