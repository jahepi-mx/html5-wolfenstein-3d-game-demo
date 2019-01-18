class Raycaster {
    
    constructor(numberOfRays) {
        this.fov = 60 * Math.PI / 180;
        this.numberOfRays = numberOfRays;
        this.radStep = this.fov / (this.numberOfRays - 1);
        this.tileDirs = [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1]];
        this.data = [];
    }
    
    sprites() {
        var radians = player.rotation;
        var center = new Vector(1, 0).setUnitAngle(radians);
        var right = new Vector(1, 0).setUnitAngle(radians - this.fov / 2);
        for (let sprite of sprites) {
            var spriteVector = sprite.position.sub(player.position);
            var z = spriteVector.length();
            spriteVector = spriteVector.normalize();
            var dot = spriteVector.dot(center);
            if (dot >= 0) {
                dot = dot > 1 ? 1 : dot < -1 ? -1 : dot;
                var angle = Math.acos(dot);
                if (angle < this.fov) {
                    var finalRadians = this.fov / 2;
                    var diff = spriteVector.sub(center);
                    finalRadians += diff.dot(right) >= 0 ? angle : -angle;
                    var x = finalRadians / this.fov * outputWidth;
                    this.data.push({z: z, x: x, sprite: sprite, door:false});
                }
            }
        }
    }
    
    wallsAndDoors() {
        var tmpX = 0;
        var radians = player.rotation + this.fov / 2;
        for (var a = 0; a < this.numberOfRays; a++) {
            var minRayLen = 1 << 30; // 30 bit number enough?
            var minVector = null;
            // Direction line
            var vector = new Vector(200, 0);
            vector.setAngle(radians);
            var rayVector = vector.clone();
            // Calculate ray collision on rows
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            var doorVector = new Vector(cos, sin).mul(map.tileLength / 2);
            for (var y = 0; y <= map.height; y++) {
                var newY = map.tileLength * y - player.position.y;
                var hyp = newY / sin;
                var newX = cos * hyp;
                var vector = new Vector(newX, newY);
                // Vector has the same direction as the ray
                var dot = vector.dot(rayVector);
                if (dot > 0) {
                    vector.addThis(player.position);
                    // Check if ray point collide with a door
                    var newRayDoorVector = vector.add(doorVector);
                    var door = this.collideDoor(newRayDoorVector, MAP_DOOR_ROW);
                    if (door !== null && door.isPixelVisible(newRayDoorVector)) {
                        var z = this.getFixedZ(newRayDoorVector, radians);
                        this.data.push({z: z, x: tmpX * pixelWidth, sprite:null, door:true});
                    }
                    // Check if ray point collide with a wall     
                    if (this.collideWall(vector)) {
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
                    // Check if ray point collide with a door
                    var newRayDoorVector = vector.add(doorVector);
                    var door = this.collideDoor(newRayDoorVector, MAP_DOOR_COL);
                    if (door !== null && door.isPixelVisible(newRayDoorVector)) {
                        var z = this.getFixedZ(newRayDoorVector, radians);
                        this.data.push({z: z, x: tmpX * pixelWidth, sprite:null, door:true});
                    }
                    // Check if ray point collide with a wall
                    if (this.collideWall(vector)) {
                        var diff = vector.sub(player.position);
                        if (diff.dot(diff) < minRayLen) {
                            minRayLen = diff.dot(diff);
                            minVector = vector;
                        }
                    }
                }
            }        
            if (minVector !== null) {
                var z = this.getFixedZ(minVector, radians);
                this.data.push({z: z, x: tmpX * pixelWidth, sprite:null, door:false});
                //context.fillStyle = "#00ff00";
                //context.fillRect(origX + minVector.x, origY - minVector.y, 2, 2);
            }
            radians -= this.radStep;
            tmpX++;
        }
    }
    
    getFixedZ(vector, radians) {
        // Calculate distance of the ray avoiding distortion (fish eye effect)
        var ray = vector.sub(player.position);
        var length = ray.length();
        var radDiff = player.rotation - radians;
        return Math.cos(radDiff) * length;
    }
    
    collideWall(vector) {
        var xp = parseInt(vector.x / map.tileLength);
        var yp = parseInt(vector.y / map.tileLength);
        for (let tileDir of this.tileDirs) {
            var newX = tileDir[0] + xp;
            var newY = tileDir[1] + yp;
            if (newX >= 0 && newX < map.width && newY >= 0 && newY < map.height) {
                var wall = map.walls[newY * map.width + newX];
                if (wall !== undefined) {
                    var diff = vector.sub(wall.position);
                    if (Math.abs(diff.y) <= map.tileLength / 2  && Math.abs(diff.x) <= map.tileLength / 2) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    collideDoor(vector, type) {
        var xp = parseInt(vector.x / map.tileLength);
        var yp = parseInt(vector.y / map.tileLength);
        for (let tileDir of this.tileDirs) {
            var newX = tileDir[0] + xp;
            var newY = tileDir[1] + yp;
            if (newX >= 0 && newX < map.width && newY >= 0 && newY < map.height) {
                var door = map.doors[newY * map.width + newX];
                if (door !== undefined && door.type === type) {
                    var diff = vector.sub(door.position);
                    if (Math.abs(diff.y) <= map.tileLength / 2  && Math.abs(diff.x) <= map.tileLength / 2) {
                        return door;
                    }
                }
            }
        }
        return null;
    }
    
    getData() {
        this.data = [];
        this.sprites();
        this.wallsAndDoors();
        
        this.data.sort(function(o1, o2) {
            return o1.z < o2.z ? 1 : o1.z > o2.z ? -1 : 0;
        });
        
        return this.data;
    }
}
