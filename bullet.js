class Bullet {
    
    constructor(position) {
        this.moves = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
        this.position = position;
        this.velocity = new Vector(Math.cos(player.rotation), Math.sin(player.rotation)).mul(30);
        this.length = 10;
        this.collided = false;
    }
    
    update(dt) {
        var x = parseInt(this.position.x / map.tileLength);
        var y = parseInt(this.position.y / map.tileLength);
        for (let move of this.moves) {
            var newX = move[0] + x;
            var newY = move[1] + y;
            if (newX >= 0 && newX < map.width && newY >= 0 && newY < map.height) {
                var tile = map.tiles[newY * map.width + newX];
                if (!tile.walkable) {
                    var len = this.length / 2 + tile.length / 2;
                    var diff = tile.position.sub(this.position);
                    if (Math.abs(diff.x) <= len && Math.abs(diff.y) <= len) {
                        this.collided = true;
                        break;
                    }
                }
            }
        }
        this.position.addThis(this.velocity.mul(dt));
    }
    
    render(context) {
        context.fillStyle = "#ccc";
        context.fillRect(origX + (this.position.x - this.length / 2), origY - (this.position.y + this.length / 2), this.length, this.length);
    }
}