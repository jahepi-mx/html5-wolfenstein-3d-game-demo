class Raycasting {
    
    constructor(numberOfRays) {
        this.fov = Math.PI / 2; // 90 degrees
        this.numberOfRays = numberOfRays;
        this.radStep = this.fov / (this.numberOfRays - 1);
        this.tileDirs = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    }
    
    update(dt) {   
    }
    
    render(context) {
        context.strokeStyle = "#cdcdcd";
        context.fillStyle = "#00ff00";
        var radians = player.rotation - this.fov / 2;
        for (var a = 0; a < this.numberOfRays; a++) {
            var minRayLen = 1 << 16; // 16 bit number enough?
            var minVector = null;
            // Direction line
            var vector = new Vector(200, 0);
            vector.setAngle(radians);
            var rayVector = vector.clone()
            vector.addThis(player.position);
            context.beginPath();
            context.moveTo(origX + player.position.x, origY - player.position.y);
            context.lineTo(origX + vector.x, origY - vector.y);
            context.stroke();   
            // Calculate ray collision on rows
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            for (var y = 0; y <= map.height; y++) {
                var newY = map.tileLength * y - player.position.y;
                var hyp = newY / sin;
                var newX = cos * hyp;
                var vector = new Vector(newX, newY);
                // Vector has the same direction as the ray
                var dot = vector.dot(rayVector);
                if (dot > 0) {
                    vector.addThis(player.position);
                    // Check if ray point collide with a tile     
                    if (this.collide(vector)) {
                        var diff = vector.sub(player.position);
                        if (diff.dot(diff) < minRayLen) {
                            minRayLen = diff.dot(diff);
                            minVector = vector;
                        }
                    }
                }
            }
            // Calculate ray collision on cols
            for (var x = 0; x <= map.width; x++) {
                var newX = map.tileLength * x - player.position.x;
                var hyp = newX / cos;
                var newY = sin * hyp;
                var vector = new Vector(newX, newY);
                // Vector has the same direction as the ray
                var dot = vector.dot(rayVector);
                if (dot > 0) {
                    vector.addThis(player.position);
                    // Check if ray point collide with a tile
                    if (this.collide(vector)) {
                        var diff = vector.sub(player.position);
                        if (diff.dot(diff) < minRayLen) {
                            minRayLen = diff.dot(diff);
                            minVector = vector;
                        }
                    }
                }
            }        
            radians += this.radStep;
            if (minVector !== null) {
                context.fillRect(origX + minVector.x, origY - minVector.y, 2, 2);
            }
        }
    }
    
    collide(vector) {
        var xp = parseInt(vector.x / map.tileLength);
        var yp = parseInt(vector.y / map.tileLength);
        for (let tileDir of this.tileDirs) {
            var newX = tileDir[0] + xp;
            var newY = tileDir[1] + yp;
            if (newX >= 0 && newX < map.width && newY >= 0 && newY < map.height) {
                var tile = map.tiles[newY * map.width + newX];
                if (!tile.walkable) {
                    var diff = vector.sub(tile.position);
                    if (Math.abs(diff.y) <= map.tileLength / 2  && Math.abs(diff.x) <= map.tileLength / 2) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
