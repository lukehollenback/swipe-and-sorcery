import { GAME_SETTINGS } from '../config/GameConfig';

export default class SwipeController {
  constructor(scene) {
    this.scene = scene;
    this.startPoint = null;
    this.startTime = null;
    this.isEnabled = true;
    this.swipeCallback = null;
    
    this.initializeSwipeDetection();
  }

  initializeSwipeDetection() {
    this.scene.input.on('pointerdown', this.onPointerDown, this);
    this.scene.input.on('pointerup', this.onPointerUp, this);
    this.scene.input.on('pointermove', this.onPointerMove, this);
  }

  onPointerDown(pointer) {
    if (!this.isEnabled) return;
    
    this.startPoint = {
      x: pointer.x,
      y: pointer.y
    };
    this.startTime = pointer.downTime;
  }

  onPointerMove(pointer) {
    if (!this.isEnabled || !this.startPoint || !pointer.isDown) return;
    
    const currentTime = this.scene.time.now;
    const timeDiff = currentTime - this.startTime;
    
    // Check if swipe is too slow
    if (timeDiff > GAME_SETTINGS.SWIPE_TIME_THRESHOLD) {
      this.startPoint = null;
      return;
    }
  }

  onPointerUp(pointer) {
    if (!this.isEnabled || !this.startPoint) return;
    
    const endPoint = {
      x: pointer.x,
      y: pointer.y
    };
    
    const timeDiff = pointer.upTime - this.startTime;
    
    // Check if gesture was quick enough
    if (timeDiff > GAME_SETTINGS.SWIPE_TIME_THRESHOLD) {
      this.startPoint = null;
      return;
    }
    
    const direction = this.calculateSwipeDirection(this.startPoint, endPoint);
    
    if (direction && this.swipeCallback) {
      this.swipeCallback(direction);
    }
    
    this.startPoint = null;
  }

  calculateSwipeDirection(start, end) {
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Check if swipe is long enough
    if (absX < GAME_SETTINGS.SWIPE_THRESHOLD && absY < GAME_SETTINGS.SWIPE_THRESHOLD) {
      return null;
    }
    
    // Determine primary direction
    if (absX > absY) {
      return deltaX > 0 ? 'right' : 'left';
    } else {
      return deltaY > 0 ? 'down' : 'up';
    }
  }

  onSwipe(callback) {
    this.swipeCallback = callback;
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
    this.startPoint = null;
  }

  destroy() {
    this.scene.input.off('pointerdown', this.onPointerDown, this);
    this.scene.input.off('pointerup', this.onPointerUp, this);
    this.scene.input.off('pointermove', this.onPointerMove, this);
  }
}