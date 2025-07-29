import { GAME_SETTINGS } from '../config/GameConfig';

export default class DungeonGenerator {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.tileSize = GAME_SETTINGS.TILE_SIZE;
    this.tiles = [];
    this.rooms = [];
    this.corridors = [];
  }

  generate(config = {}) {
    const {
      minRoomSize = 5,
      maxRoomSize = 9,
      roomCount = 8,
      corridorWidth = 3
    } = config;

    // Initialize grid with walls
    this.initializeGrid();
    
    // Generate rooms
    this.generateRooms(roomCount, minRoomSize, maxRoomSize);
    
    // Connect rooms with corridors
    this.connectRooms(corridorWidth);
    
    // Place dungeon features
    this.placeFeatures();
    
    return {
      tiles: this.tiles,
      rooms: this.rooms,
      spawnPoint: this.getSpawnPoint(),
      exitPoint: this.getExitPoint()
    };
  }

  initializeGrid() {
    this.tiles = [];
    for (let y = 0; y < this.height; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.tiles[y][x] = 'wall';
      }
    }
  }

  generateRooms(count, minSize, maxSize) {
    let attempts = 0;
    const maxAttempts = count * 10;
    
    while (this.rooms.length < count && attempts < maxAttempts) {
      attempts++;
      
      const room = {
        x: Phaser.Math.Between(1, this.width - maxSize - 1),
        y: Phaser.Math.Between(1, this.height - maxSize - 1),
        width: Phaser.Math.Between(minSize, maxSize),
        height: Phaser.Math.Between(minSize, maxSize)
      };
      
      if (!this.doesRoomOverlap(room)) {
        this.rooms.push(room);
        this.carveRoom(room);
      }
    }
  }

  doesRoomOverlap(room) {
    for (const other of this.rooms) {
      if (room.x < other.x + other.width + 2 &&
          room.x + room.width + 2 > other.x &&
          room.y < other.y + other.height + 2 &&
          room.y + room.height + 2 > other.y) {
        return true;
      }
    }
    return false;
  }

  carveRoom(room) {
    for (let y = room.y; y < room.y + room.height; y++) {
      for (let x = room.x; x < room.x + room.width; x++) {
        if (y < this.height && x < this.width) {
          this.tiles[y][x] = 'floor';
        }
      }
    }
  }

  connectRooms(corridorWidth) {
    for (let i = 0; i < this.rooms.length - 1; i++) {
      const roomA = this.rooms[i];
      const roomB = this.rooms[i + 1];
      
      const startX = Math.floor(roomA.x + roomA.width / 2);
      const startY = Math.floor(roomA.y + roomA.height / 2);
      const endX = Math.floor(roomB.x + roomB.width / 2);
      const endY = Math.floor(roomB.y + roomB.height / 2);
      
      // Create L-shaped corridor
      if (Math.random() < 0.5) {
        this.createHorizontalCorridor(startX, endX, startY, corridorWidth);
        this.createVerticalCorridor(startY, endY, endX, corridorWidth);
      } else {
        this.createVerticalCorridor(startY, endY, startX, corridorWidth);
        this.createHorizontalCorridor(startX, endX, endY, corridorWidth);
      }
    }
  }

  createHorizontalCorridor(x1, x2, y, width) {
    const start = Math.min(x1, x2);
    const end = Math.max(x1, x2);
    const halfWidth = Math.floor(width / 2);
    
    for (let x = start; x <= end; x++) {
      for (let w = -halfWidth; w <= halfWidth; w++) {
        const tileY = y + w;
        if (tileY >= 0 && tileY < this.height && x >= 0 && x < this.width) {
          this.tiles[tileY][x] = 'floor';
        }
      }
    }
  }

  createVerticalCorridor(y1, y2, x, width) {
    const start = Math.min(y1, y2);
    const end = Math.max(y1, y2);
    const halfWidth = Math.floor(width / 2);
    
    for (let y = start; y <= end; y++) {
      for (let w = -halfWidth; w <= halfWidth; w++) {
        const tileX = x + w;
        if (y >= 0 && y < this.height && tileX >= 0 && tileX < this.width) {
          this.tiles[y][tileX] = 'floor';
        }
      }
    }
  }

  placeFeatures() {
    // Place coins in rooms
    this.rooms.forEach((room, index) => {
      if (index !== 0 && index !== this.rooms.length - 1) {
        const coinCount = Phaser.Math.Between(2, 5);
        for (let i = 0; i < coinCount; i++) {
          const x = Phaser.Math.Between(room.x + 1, room.x + room.width - 2);
          const y = Phaser.Math.Between(room.y + 1, room.y + room.height - 2);
          if (this.tiles[y][x] === 'floor') {
            this.tiles[y][x] = 'coin';
          }
        }
      }
    });
    
    // Place enemies
    this.rooms.forEach((room, index) => {
      if (index !== 0) { // Not in spawn room
        const enemyCount = Phaser.Math.Between(0, 2);
        for (let i = 0; i < enemyCount; i++) {
          const x = Phaser.Math.Between(room.x + 1, room.x + room.width - 2);
          const y = Phaser.Math.Between(room.y + 1, room.y + room.height - 2);
          if (this.tiles[y][x] === 'floor') {
            this.tiles[y][x] = 'enemy';
          }
        }
      }
    });
    
    // Place chests in some rooms
    const chestRooms = Phaser.Math.Between(1, 3);
    for (let i = 0; i < chestRooms; i++) {
      const roomIndex = Phaser.Math.Between(1, this.rooms.length - 2);
      const room = this.rooms[roomIndex];
      const x = Math.floor(room.x + room.width / 2);
      const y = Math.floor(room.y + room.height / 2);
      if (this.tiles[y][x] === 'floor') {
        this.tiles[y][x] = 'chest';
      }
    }
  }

  getSpawnPoint() {
    if (this.rooms.length === 0) return { x: 1, y: 1 };
    const room = this.rooms[0];
    return {
      x: Math.floor(room.x + room.width / 2) * this.tileSize,
      y: Math.floor(room.y + room.height / 2) * this.tileSize
    };
  }

  getExitPoint() {
    if (this.rooms.length === 0) return { x: this.width - 2, y: this.height - 2 };
    const room = this.rooms[this.rooms.length - 1];
    return {
      x: Math.floor(room.x + room.width / 2) * this.tileSize,
      y: Math.floor(room.y + room.height / 2) * this.tileSize
    };
  }
}