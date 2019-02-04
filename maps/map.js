let MAP_EMPTY = 1;
let MAP_WALL = 12;
let MAP_DOOR_COL = 9;
let MAP_DOOR_ROW = 11;
let MAP_WALL_DOOR_COL = 8;
let MAP_WALL_DOOR_ROW = 10;
let MAP_SPRITE = 2;
let MAP_MOVING_WALL = 3;
let MAP_SOLDIER = 5;
let MAP_DOG = 6;
let MAP_BOSS= 7;
let MAP_LIFE = 4;

class Map {
    constructor(player, exitVector) {
        this.tileLength = 32;
        this.width = 0;
        this.height = 0;
        this.tiles = [];
        this.walls = [];
        this.movingWalls = [];
        this.doors = [];
        this.sprites = [];
        this.enemies = [];
        this.items = [];
        this.map = [];
        this.player = player;
        this.exitVector = exitVector;
        this.exitTile = null;
        this.isFinished = false;
        this.enemyParams = [];
        this.ceilingColor = "#21190c";
        this.floorColor = "#312512";
    }
    
    load() {
        
        for (var a = 0; a < this.width * this.height; a++) {
            var x = a % this.width;
            var y = parseInt(a / this.width);
            var value = this.map[a];
            var newY = (this.height - 1) - y;
            
            var tile = null;
            if (value === MAP_SOLDIER) {
                tile = new Tile(x, newY, value, this.tileLength, true);
                var param = this.enemyParams[newY * 32 + x];
                var enemy = new Soldier(x, newY, param.velocity, this, param.dirRadians, param.shootTimeLimit, param.shootDistance, param.unawarenessDistance, param.awarenessDistance, param.life);
                this.enemies.push(enemy);
            }
            if (value === MAP_DOG) {
                tile = new Tile(x, newY, value, this.tileLength, true);
                var param = this.enemyParams[newY * 32 + x];
                var enemy = new Dog(x, newY, param.velocity, this, param.dirRadians, param.life);
                this.enemies.push(enemy);
            }
            if (value === MAP_BOSS) {
                tile = new Tile(x, newY, value, this.tileLength, true);
                var param = this.enemyParams[newY * 32 + x];
                var enemy = new Boss(x, newY, param.velocity, this, param.shootTimeLimit, param.life);
                this.enemies.push(enemy);
            }
            if (value === MAP_LIFE) {
                tile = new Tile(x, newY, value, this.tileLength, true);
                this.items.push(new Life(x, newY, this.tileLength));
            }
            if (value >= MAP_WALL || value === MAP_EMPTY
                    || value === MAP_WALL_DOOR_COL || value === MAP_WALL_DOOR_ROW) {
                tile = new Tile(x, newY, value, this.tileLength, value === MAP_EMPTY);
                if (value >= MAP_WALL || value === MAP_WALL_DOOR_COL || value === MAP_WALL_DOOR_ROW) {
                    this.walls[newY * this.width + x] = tile;
                }
                if (value === MAP_WALL_DOOR_COL) {
                    tile.rowImage = "tile8";
                    tile.colImage = "tile12";
                }
                if (value === MAP_WALL_DOOR_ROW) {
                    tile.colImage = "tile8";
                    tile.rowImage = "tile12";
                }
            }
            if (value === MAP_DOOR_ROW || value === MAP_DOOR_COL) {
                tile = new Door(x, newY, value, this.tileLength);
                this.doors[newY * this.width + x] = tile;
            }
            if (value === MAP_SPRITE) {
                tile = new Sprite(x, newY, value, this.tileLength, false);
                this.sprites.push(tile);
            }
            
            if (value === MAP_MOVING_WALL) {
                var param = this.enemyParams[newY * 32 + x];
                tile = new MovingWall(x, newY, value, this.tileLength, param.velocity, param.vertical, param.numberOfBlocksToMove);
                this.movingWalls.push(tile);
            }
            
            if (this.exitVector !== null && 
                    this.exitVector.x === x && this.exitVector.y === newY) {
                this.exitTile = tile;
            }
            
            this.tiles[newY * this.width + x] = tile;
        }
    }
    
    reset() {
        
    }
    
    update() {
        
    }
}


