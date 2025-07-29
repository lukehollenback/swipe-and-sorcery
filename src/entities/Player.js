import { GAME_SETTINGS } from '../config/GameConfig';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.isMoving = false;
    this.moveDirection = null;
    this.stats = {
      health: 100,
      maxHealth: 100,
      speed: GAME_SETTINGS.PLAYER_SPEED,
      coins: 0,
      level: 1
    };
    
    this.setSize(40, 40);
    this.setCollideWorldBounds(true);
    
    // Create particle emitter for movement trail
    this.createParticleTrail();
  }

  createParticleTrail() {
    try {
      const particles = this.scene.add.particles(0, 0, 'particle', {
        speed: { min: 50, max: 150 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        lifespan: 300,
        frequency: 50
      });
      
      particles.startFollow(this);
      this.particleEmitter = particles;
      this.particleEmitter.stop();
    } catch (error) {
      console.warn('Failed to create particle trail:', error);
      // Create a dummy emitter to prevent crashes
      this.particleEmitter = {
        start: () => {},
        stop: () => {},
        destroy: () => {}
      };
    }
  }

  moveInDirection(direction) {
    if (this.isMoving) return;
    
    this.isMoving = true;
    this.moveDirection = direction;
    
    // Start particle effect
    this.particleEmitter.start();
    
    // Set velocity based on direction
    switch (direction) {
      case 'up':
        this.setVelocity(0, -this.stats.speed);
        break;
      case 'down':
        this.setVelocity(0, this.stats.speed);
        break;
      case 'left':
        this.setVelocity(-this.stats.speed, 0);
        break;
      case 'right':
        this.setVelocity(this.stats.speed, 0);
        break;
    }
    
    // Add a slight rotation effect
    this.scene.tweens.add({
      targets: this,
      angle: this.angle + 360,
      duration: 500,
      ease: 'Power2'
    });
  }

  stopMovement() {
    this.setVelocity(0, 0);
    this.isMoving = false;
    this.moveDirection = null;
    
    // Stop particle effect
    this.particleEmitter.stop();
    
    // Snap to grid
    this.snapToGrid();
  }

  snapToGrid() {
    const tileSize = GAME_SETTINGS.TILE_SIZE;
    const snappedX = Math.round(this.x / tileSize) * tileSize;
    const snappedY = Math.round(this.y / tileSize) * tileSize;
    
    this.scene.tweens.add({
      targets: this,
      x: snappedX,
      y: snappedY,
      duration: 100,
      ease: 'Power2'
    });
  }

  collectCoin(amount = 1) {
    this.stats.coins += amount;
    
    // Create collection effect
    const collectText = this.scene.add.text(this.x, this.y - 30, `+${amount}`, {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#f1c40f',
      stroke: '#000000',
      strokeThickness: 2
    });
    
    this.scene.tweens.add({
      targets: collectText,
      y: collectText.y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => collectText.destroy()
    });
  }

  takeDamage(amount) {
    this.stats.health -= amount;
    
    // Flash red
    this.setTint(0xff0000);
    this.scene.time.delayedCall(200, () => {
      this.clearTint();
    });
    
    // Screen shake
    this.scene.cameras.main.shake(200, 0.01);
    
    if (this.stats.health <= 0) {
      this.die();
    }
  }

  heal(amount) {
    this.stats.health = Math.min(this.stats.health + amount, this.stats.maxHealth);
    
    // Flash green
    this.setTint(0x00ff00);
    this.scene.time.delayedCall(200, () => {
      this.clearTint();
    });
  }

  die() {
    this.isMoving = false;
    this.setVelocity(0, 0);
    
    // Death animation
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scale: 0,
      angle: 720,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        this.scene.events.emit('playerDeath');
      }
    });
  }

  update() {
    // Update logic if needed
  }
}