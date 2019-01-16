let MAP_EMPTY = 0;
let MAP_WALL = 1;
let MAP_DOOR_COL = 2;
let MAP_DOOR_ROW = 3;

class Map {
    constructor() {
        var map = [
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,2,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,1,0,0,0,0,1,3,1,0,0,1,
            1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1,
            1,0,0,1,1,0,0,0,0,0,1,0,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        ];
        
        this.tileLength = 30;
        this.width = 16;
        this.height = 6;
        this.tiles = [];
        this.walls = [];
        this.doors = [];
        for (var a = 0; a < this.width * this.height; a++) {
            var x = a % this.width;
            var y = parseInt(a / this.width);
            var value = map[a];
            var newY = (this.height - 1) - y;
            
            var tile = null;
            if (value === MAP_WALL || value === MAP_EMPTY) {
                tile = new Tile(x, newY, value, this.tileLength, value === 0);
                if (value === MAP_WALL) {
                    this.walls[newY * this.width + x] = tile;
                }
            }
            if (value === MAP_DOOR_ROW || value === MAP_DOOR_COL) {
                tile = new Door(x, newY, value, this.tileLength);
                this.doors[newY * this.width + x] = tile;
            }
            
            this.tiles[newY * this.width + x] = tile;
        }
    }
}


