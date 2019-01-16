class Map {
    constructor() {
        var map = [
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,1,1,0,0,0,0,0,1,0,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        ];
        var walls = [
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,1,0,0,0,0,1,0,1,0,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,1,1,0,0,0,0,0,1,0,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        ];
        var doors = [
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
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
            this.tiles[newY * this.width + x] = new Tile(x, newY, this.tileLength, value === 0);
            
            var door = doors[a];
            if (door > 0) {
                this.doors[newY * this.width + x] = new Door(x, newY, this.tileLength, door);
            }
        }
    }
}


