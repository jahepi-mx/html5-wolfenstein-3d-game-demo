class Player {
    constructor(x, y, length) {
        this.moves = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
        this.length = length;
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.velocityLength = new Vector(50, 50).length();
        this.friction = 0.95;
        this.rotation = 0;
        this.radianStep = Math.PI / 4;
        this.rotateLeftBool = false;
        this.rotateRightBool = false;
        this.forwardBool = false;
    }
    
    update(dt) {
        
        if (this.forwardBool) {
            this.velocity.x = this.velocityLength;
            this.velocity.y = 0;
        }
        
        if (this.rotateLeftBool) {
            this.rotation -= this.radianStep * dt; 
        }
        
        if (this.rotateRightBool) {
            this.rotation += this.radianStep * dt;
        }
        
        this.velocity.setAngle(this.rotation);

        var prevPosition = this.position.clone();
        this.position.x += this.velocity.x * dt;
        var collide = false;
        var x = parseInt(this.position.x / map.tileLength);
        var y = parseInt(this.position.y / map.tileLength);
        for (let move of this.moves) {
            var newX = move[0] + x;
            var newY = move[1] + y;
            if (newX >= 0 && newX < map.width && newY >= 0 && newY < map.height) {
                var tile = map.tiles[newY * map.width + newX];
                if (!tile.walkable) {
                    var offset = tile.position.sub(this.position);
                    var length = tile.length / 2 + this.length / 2;
                    if (Math.abs(offset.x) <= length && Math.abs(offset.y) <= length) {
                        collide = true;
                        break;
                    }
                }
            }
        }
        if (collide) {
            this.position = prevPosition;
            collide = false;
        }
        prevPosition = this.position.clone();
        this.position.y += this.velocity.y * dt;
        x = parseInt(this.position.x / map.tileLength);
        y = parseInt(this.position.y / map.tileLength);
        for (let move of this.moves) {
            var newX = move[0] + x;
            var newY = move[1] + y;
            if (newX >= 0 && newX < map.width && newY >= 0 && newY < map.height) {
                var tile = map.tiles[newY * map.width + newX];
                if (!tile.walkable) {
                    var offset = tile.position.sub(this.position);
                    var length = tile.length / 2 + this.length / 2;
                    if (Math.abs(offset.x) <= length && Math.abs(offset.y) <= length) {
                        collide = true;
                        break;
                    }
                }
            }
        }
        if (collide) {
            this.position = prevPosition;
        }
        this.velocity.mulThis(this.friction); 
    }
    
    render(context) {
        context.fillStyle = "#ccc";
        context.fillRect(origX + (this.position.x - this.length / 2), origY - (this.position.y + this.length / 2), this.length, this.length);
        
        // Direction line
        var vector = new Vector(20, 0);
        vector.setAngle(this.rotation);
        vector.addThis(this.position);
        context.strokeStyle = "#ff0000";
        context.beginPath();
        context.moveTo(origX + this.position.x, origY - this.position.y);
        context.lineTo(origX + vector.x, origY - vector.y);
        context.stroke();
    }
    
    rotateLeft(bool) {
        this.rotateLeftBool = bool;
    }
    
    rotateRight(bool) {
        this.rotateRightBool = bool;
    }
    
    forward(bool) {
        this.forwardBool = bool;
    }
}

