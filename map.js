let MAP_EMPTY = 0;
let MAP_WALL = 1;
let MAP_DOOR_COL = 2;
let MAP_DOOR_ROW = 3;
let MAP_WALL_DOOR_COL = 4;
let MAP_WALL_DOOR_ROW = 5;
let MAP_SPRITE = 6;
let MAP_MOVING_WALL = 7;

class Map {
    constructor() {
        var map = [
            1,1,1,1,1,4,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,2,0,0,7,0,0,7,0,0,0,1,
            1,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1,
            1,0,6,0,0,1,0,0,0,0,1,5,3,5,1,1,
            1,0,0,0,0,0,0,0,1,0,4,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1,
            1,0,1,0,0,1,0,0,0,0,4,0,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        ];
        
        this.tileLength = 32;
        this.width = 16;
        this.height = 8;
        this.tiles = [];
        this.walls = [];
        this.movingWalls = [];
        this.doors = [];
        this.sprites = [];
        for (var a = 0; a < this.width * this.height; a++) {
            var x = a % this.width;
            var y = parseInt(a / this.width);
            var value = map[a];
            var newY = (this.height - 1) - y;
            
            var tile = null;
            if (value === MAP_WALL || value === MAP_EMPTY
                    || value === MAP_WALL_DOOR_COL || value === MAP_WALL_DOOR_ROW) {
                tile = new Tile(x, newY, value, this.tileLength, value === 0);
                if (value === MAP_WALL || value === MAP_WALL_DOOR_COL || value === MAP_WALL_DOOR_ROW) {
                    this.walls[newY * this.width + x] = tile;
                }
                if (value === MAP_WALL_DOOR_COL) {
                    tile.rowImage = "tile21";
                }
                if (value === MAP_WALL_DOOR_ROW) {
                    tile.colImage = "tile21";
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
                tile = new MovingWall(x, newY, value, this.tileLength);
                this.movingWalls.push(tile);
            }
            
            this.tiles[newY * this.width + x] = tile;
        }
    }
}


