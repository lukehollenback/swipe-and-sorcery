import Phaser from 'phaser';
import { GAME_SETTINGS } from '../config/GameConfig';
import Player from '../entities/Player';
import SwipeController from '../systems/SwipeController';
import DungeonGenerator from '../systems/DungeonGenerator';

export default class DungeonScene extends Phaser.Scene {
  constructor() {
    super({ key: 'DungeonScene' });
  }

  create() {
    try {
      // Generate dungeon
      const generator = new DungeonGenerator(20, 30);
      this.dungeonData = generator.generate();
      
      // Create tilemap
      this.createDungeon();
      
      // Create player
      this.player = new Player(this, this.dungeonData.spawnPoint.x, this.dungeonData.spawnPoint.y);
      
      // Create exit portal
      this.createExitPortal();
      
      // Initialize swipe controls
      this.swipeController = new SwipeController(this);
      this.swipeController.onSwipe((direction) => {
        this.handleSwipe(direction);
      });
      
      // Set up camera
      this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
      this.cameras.main.setZoom(1.2);
      
      // Set up collisions
      this.setupCollisions();
      
      // Create UI overlay
      this.scene.launch('GameUIScene', { player: this.player });
      
      // Keyboard controls for testing
      this.cursors = this.input.keyboard.createCursorKeys();
    } catch (error) {
      console.error('Failed to create dungeon scene:', error);
      // Fallback - return to main menu
      this.scene.start('MainMenuScene');
    }
  }

  createDungeon() {
    const tileSize = GAME_SETTINGS.TILE_SIZE;
    this.walls = this.physics.add.staticGroup();
    this.floors = this.add.group();
    this.coins = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.chests = this.physics.add.group();
    
    for (let y = 0; y < this.dungeonData.tiles.length; y++) {
      for (let x = 0; x < this.dungeonData.tiles[y].length; x++) {
        const tileType = this.dungeonData.tiles[y][x];
        const worldX = x * tileSize;
        const worldY = y * tileSize;
        
        try {
          switch (tileType) {
            case 'wall':
              const wall = this.walls.create(worldX, worldY, 'wall');
              wall.setOrigin(0, 0);
              break;
              
            case 'floor':
              const floor = this.add.image(worldX, worldY, 'floor');
              floor.setOrigin(0, 0);
              this.floors.add(floor);
              break;
              
            case 'coin':
              const floorUnderCoin = this.add.image(worldX, worldY, 'floor');
              floorUnderCoin.setOrigin(0, 0);
              this.floors.add(floorUnderCoin);
              
              const coin = this.coins.create(worldX + tileSize/2, worldY + tileSize/2, 'coin');
              this.createCoinAnimation(coin);
              break;
              
            case 'enemy':
              const floorUnderEnemy = this.add.image(worldX, worldY, 'floor');
              floorUnderEnemy.setOrigin(0, 0);
              this.floors.add(floorUnderEnemy);
              
              const enemy = this.enemies.create(worldX + tileSize/2, worldY + tileSize/2, 'enemy');
              this.createEnemyBehavior(enemy);
              break;
              
            case 'chest':
              const floorUnderChest = this.add.image(worldX, worldY, 'floor');
              floorUnderChest.setOrigin(0, 0);
              this.floors.add(floorUnderChest);
              
              const chest = this.chests.create(worldX + tileSize/2, worldY + tileSize/2, 'chest');
              chest.isOpened = false;
              break;
          }
        } catch (error) {
          console.warn(`Failed to create tile at (${x}, ${y}):`, error);
          // Create a basic floor tile as fallback
          try {
            const fallbackFloor = this.add.rectangle(worldX + tileSize/2, worldY + tileSize/2, tileSize, tileSize, 0x7f8c8d);
            this.floors.add(fallbackFloor);
          } catch (fallbackError) {
            console.error('Even fallback tile creation failed:', fallbackError);  
          }
        }
      }
    }
  }

  createExitPortal() {
    this.exitPortal = this.physics.add.sprite(
      this.dungeonData.exitPoint.x,
      this.dungeonData.exitPoint.y,
      'portal'
    );
    
    // Add spinning animation
    this.tweens.add({
      targets: this.exitPortal,
      angle: 360,
      duration: 3000,
      repeat: -1
    });
    
    // Add pulsing effect
    this.tweens.add({
      targets: this.exitPortal,
      scale: { from: 0.9, to: 1.1 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  createCoinAnimation(coin) {
    this.tweens.add({
      targets: coin,
      y: coin.y - 5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  createEnemyBehavior(enemy) {
    // Simple patrol behavior
    const moveDistance = GAME_SETTINGS.TILE_SIZE * 2;
    this.tweens.add({
      targets: enemy,
      x: enemy.x + moveDistance,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Linear'
    });
  }

  setupCollisions() {
    // Player vs walls
    this.physics.add.collider(this.player, this.walls, () => {
      this.player.stopMovement();
    });
    
    // Player vs coins
    this.physics.add.overlap(this.player, this.coins, (player, coin) => {
      this.collectCoin(coin);
    });
    
    // Player vs enemies
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (!this.player.isInvulnerable) {
        this.player.takeDamage(10);
        this.player.isInvulnerable = true;
        this.time.delayedCall(1000, () => {
          this.player.isInvulnerable = false;
        });
      }
    });
    
    // Player vs chests
    this.physics.add.overlap(this.player, this.chests, (player, chest) => {
      if (!chest.isOpened) {
        this.openChest(chest);
      }
    });
    
    // Player vs exit
    this.physics.add.overlap(this.player, this.exitPortal, () => {
      this.completeDungeon();
    });
  }

  handleSwipe(direction) {
    if (!this.player.isMoving) {
      this.player.moveInDirection(direction);
    }
  }

  collectCoin(coin) {
    // Particle burst
    const particles = this.add.particles(coin.x, coin.y, 'particle', {
      speed: { min: 100, max: 200 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 300,
      quantity: 10,
      tint: 0xf1c40f
    });
    
    this.time.delayedCall(300, () => particles.destroy());
    
    this.player.collectCoin(1);
    coin.destroy();
  }

  openChest(chest) {
    chest.isOpened = true;
    
    // Chest opening effect
    this.tweens.add({
      targets: chest,
      scaleY: 1.2,
      duration: 200,
      yoyo: true,
      onComplete: () => {
        // Spawn random loot
        const lootType = Phaser.Math.Between(0, 2);
        switch (lootType) {
          case 0: // Coins
            const coinAmount = Phaser.Math.Between(5, 15);
            this.player.collectCoin(coinAmount);
            break;
          case 1: // Health potion
            this.player.heal(25);
            break;
          case 2: // Score multiplier
            this.player.collectCoin(20);
            break;
        }
        
        chest.setTint(0x666666);
      }
    });
  }

  completeDungeon() {
    this.swipeController.disable();
    
    // Victory effect
    this.cameras.main.flash(500);
    this.cameras.main.shake(500, 0.02);
    
    // Show completion text
    const victoryText = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      'DUNGEON COMPLETE!',
      {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#f1c40f',
        stroke: '#000000',
        strokeThickness: 4
      }
    );
    victoryText.setOrigin(0.5);
    victoryText.setScrollFactor(0);
    
    // Return to town after delay
    this.time.delayedCall(2000, () => {
      this.scene.stop('GameUIScene');
      this.scene.start('TownScene', { coins: this.player.stats.coins });
    });
  }

  update() {
    // Keyboard controls for testing
    if (this.cursors.left.isDown && !this.player.isMoving) {
      this.player.moveInDirection('left');
    } else if (this.cursors.right.isDown && !this.player.isMoving) {
      this.player.moveInDirection('right');
    } else if (this.cursors.up.isDown && !this.player.isMoving) {
      this.player.moveInDirection('up');
    } else if (this.cursors.down.isDown && !this.player.isMoving) {
      this.player.moveInDirection('down');
    }
    
    // Check for wall collisions during movement
    if (this.player.isMoving) {
      const nextX = this.player.x + this.player.body.velocity.x * 0.016;
      const nextY = this.player.y + this.player.body.velocity.y * 0.016;
      
      // Simple wall detection
      let shouldStop = false;
      this.walls.children.entries.forEach(wall => {
        const distance = Phaser.Math.Distance.Between(nextX, nextY, wall.x + 25, wall.y + 25);
        if (distance < 40) {
          shouldStop = true;
        }
      });
      
      if (shouldStop) {
        this.player.stopMovement();
      }
    }
  }
}