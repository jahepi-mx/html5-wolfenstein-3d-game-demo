class Map {
    constructor() {
        var data = [
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        ];
        this.tileLength = 30;
        this.width = 16;
        this.height = 6;
        this.tiles = [];
        for (var a = 0; a < this.width * this.height; a++) {
            var x = a % this.width;
            var y = parseInt(a / this.width);
            var value = data[a];
            var newY = (this.height - 1) - y;
            this.tiles[newY * this.width + x] = new Tile(this.tileLength * x + this.tileLength / 2, this.tileLength * newY + this.tileLength / 2, this.tileLength, value === 0);
        }
    }
}


