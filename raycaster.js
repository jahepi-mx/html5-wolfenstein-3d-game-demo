class Raycaster {
    
    constructor(numberOfRays) {
        this.fov = 60 * Math.PI / 180;
        this.numberOfRays = numberOfRays;
        this.radStep = this.fov / (this.numberOfRays - 1);
        this.tileDirs = [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1]];
        this.data = [];
        this.maxVisibility = 1000000;
        this.tmpObjects = [];
    }
    
    sprites() {
        var radians = player.rotation;
        // Vector where the player is looking at.
        var center = player.viewDirection;
        var right = new Vector(1, 0).setUnitAngle(radians - this.fov / 2);
        for (let sprite of map.sprites) {
            this.calculateSpritePosition(sprite, center, right);
        }
        for (let item of map.items) {
            this.calculateSpritePosition(item, center, right);
        }
        for (let bullet of player.bullets) {
            this.calculateSpritePosition(bullet, center, right);
        }
        for (let enemy of map.enemies) {
            this.calculateSpritePosition(enemy, center, right);
            for (let enemyBullet of enemy.bullets) {
                this.calculateSpritePosition(enemyBullet, center, right);
            }
        }
    }
    
    calculateSpritePosition(sprite, center, right) {
        var spriteVector = sprite.position.sub(player.position);
        if (spriteVector.dot(spriteVector) <= this.maxVisibility) {
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
                    this.data.push({z: z * 0.9, x: x, object: sprite});
                }
            }
        }
    }
    
    calculateMovingWalls(cos, sin, radians, tmpX) {
        var half = map.tileLength / 2;
        var vector = new Vector(0, 0);
        var rayVector = new Vector(cos, sin);
        var tmpZ = 1 << 30;
        var tmpData = null;
        var offsetFix = 0.2;
        var minVector = new Vector(0, 0);
        for (let movingWall of map.movingWalls) {
            var sub = movingWall.position.sub(player.position);
            if (sub.dot(rayVector) > 0 && sub.dot(sub) <= this.maxVisibility) {
                // Check top
                var newY = (movingWall.position.y + half) - player.position.y;
                var hyp = newY / sin;
                vector.x = cos * hyp;
                vector.y = newY;
                var z = vector.dot(vector);
                vector.addThis(player.position);
                if (Math.abs(movingWall.position.x - vector.x) - offsetFix <= half && Math.abs(movingWall.position.y - vector.y) - offsetFix <= half) {
                    if (z < tmpZ) {
                        tmpZ = z;
                        minVector.x = vector.x;
                        minVector.y = vector.y;
                        var pixelWall = vector.x - (movingWall.position.x - half);
                        tmpData = {z: 0, x: tmpX * pixelWidth, object: movingWall, pixel: pixelWall, imageType: ROW_TYPE_IMAGE};
                    }
                }
                // Check bottom
                var newY = (movingWall.position.y - half) - player.position.y;
                var hyp = newY / sin;
                vector.x = cos * hyp;
                vector.y = newY;
                var z = vector.dot(vector);
                vector.addThis(player.position);
                if (Math.abs(movingWall.position.x - vector.x) - offsetFix <= half && Math.abs(movingWall.position.y - vector.y) - offsetFix <= half) {
                    if (z < tmpZ) {
                        tmpZ = z;
                        minVector.x = vector.x;
                        minVector.y = vector.y;
                        var pixelWall = vector.x - (movingWall.position.x - half); 
                        tmpData = {z: 0, x: tmpX * pixelWidth, object: movingWall, pixel: pixelWall, imageType: ROW_TYPE_IMAGE};
                    }
                }
                // Check left
                var newX = (movingWall.position.x - half) - player.position.x;
                var hyp = newX / cos;
                vector.x = newX;
                vector.y = sin * hyp;
                var z = vector.dot(vector);
                vector.addThis(player.position);
                if (Math.abs(movingWall.position.x - vector.x) - offsetFix <= half && Math.abs(movingWall.position.y - vector.y) - offsetFix <= half) {
                    if (z < tmpZ) {
                        tmpZ = z;
                        minVector.x = vector.x;
                        minVector.y = vector.y;
                        var pixelWall = vector.y - (movingWall.position.y - half); 
                        tmpData = {z: 0, x: tmpX * pixelWidth, object: movingWall, pixel: pixelWall, imageType: COL_TYPE_IMAGE};
                    }
                }
                // Check right
                var newX = (movingWall.position.x + half) - player.position.x;
                var hyp = newX / cos;
                vector.x = newX;
                vector.y = sin * hyp;
                var z = vector.dot(vector);
                vector.addThis(player.position);
                if (Math.abs(movingWall.position.x - vector.x) - offsetFix <= half && Math.abs(movingWall.position.y - vector.y) - offsetFix <= half) {
                    if (z < tmpZ) {
                        tmpZ = z;
                        minVector.x = vector.x;
                        minVector.y = vector.y;
                        var pixelWall = vector.y - (movingWall.position.y - half); 
                        tmpData = {z: 0, x: tmpX * pixelWidth, object: movingWall, pixel: pixelWall, imageType: COL_TYPE_IMAGE};
                    }
                }
            }
        }
        if (tmpData !== null) {
            tmpData.z = this.getFixedZ(minVector.sub(player.position), radians);
        }
        return tmpData;
    }
    
    wallsAndDoors() {
        var tmpX = 0;
        var radians = player.rotation + this.fov / 2;
        for (var a = 0; a < this.numberOfRays; a++) {
            var minRayLen = 1 << 30; // 30 bit number enough?
            var minDoorRayLen = 1 << 30;
            var minVector = null;
            var minDoorVector = null;
            var doorObject = null;
            var pixelWall = 0;
            var minWall = null;
            var wallImageType = null;
            // Calculate ray collision on rows
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            // Direction line
            var rayVector = new Vector(cos, sin);
            var doorVector = new Vector(cos, sin).mul(map.tileLength / 2);
            var movingWallObject = this.calculateMovingWalls(cos, sin, radians, tmpX);
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
                        var tmpVector = newRayDoorVector.sub(player.position);
                        var dot = tmpVector.dot(tmpVector);
                        if (dot <= this.maxVisibility && dot < minDoorRayLen) {
                            minDoorVector = tmpVector;
                            minDoorRayLen = dot;
                            doorObject = {z: 0, x: tmpX * pixelWidth, object: door, pixel: newRayDoorVector.x % map.tileLength};
                        }
                    }
                    // Check if ray point collide with a wall
                    var wall = this.collideWall(vector);
                    if (wall !== null) {
                        var diff = vector.sub(player.position);
                        var dot = diff.dot(diff);
                        if (dot < minRayLen && dot <= this.maxVisibility) {
                            minRayLen = dot;
                            minVector = vector;
                            minWall = wall;
                            pixelWall = vector.x % map.tileLength;
                            wallImageType = ROW_TYPE_IMAGE;
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
                        var tmpVector = newRayDoorVector.sub(player.position);
                        var dot = tmpVector.dot(tmpVector);
                        if (dot <= this.maxVisibility && dot < minDoorRayLen) {
                            minDoorVector = tmpVector;
                            minDoorRayLen = dot;
                            doorObject = {z: 0, x: tmpX * pixelWidth, object: door, pixel: newRayDoorVector.y % map.tileLength}
                        }
                    }
                    // Check if ray point collide with a wall
                    var wall = this.collideWall(vector);
                    if (wall !== null) {
                        var diff = vector.sub(player.position);
                        var dot = diff.dot(diff);
                        if (dot < minRayLen && dot <= this.maxVisibility) {
                            minRayLen = dot;
                            minVector = vector;
                            minWall = wall;
                            pixelWall = vector.y % map.tileLength;
                            wallImageType = COL_TYPE_IMAGE;
                        }
                    }
                }
            }
            var wallObject = null;
            var objectToRender = null;
            if (doorObject !== null) {
                doorObject.z = this.getFixedZ(minDoorVector, radians);
            }
            if (minVector !== null) {
                wallObject = {z: this.getFixedZ(minVector.sub(player.position), radians), x: tmpX * pixelWidth, object: minWall, pixel: pixelWall, imageType: wallImageType};
            }
            this.tmpObjects[0] = doorObject !== null ? doorObject : null;
            this.tmpObjects[1] = wallObject !== null ? wallObject : null;
            this.tmpObjects[2] = movingWallObject !== null ? movingWallObject : null;
            var min = 1 << 30;
            for (let object of this.tmpObjects) {
                if (object !== null && object.z < min) {
                    min = object.z;
                    objectToRender = object;
                }
            }
            if (objectToRender !== null) {
                this.data.push(objectToRender);
                //context.fillStyle = "#00ff00";
                //context.fillRect(origX + minVector.x, origY - minVector.y, 2, 2);
            }
            radians -= this.radStep;
            tmpX++;
        }
    }
    
    getFixedZ(ray, radians) {
        // Calculate distance of the ray avoiding distortion (fish eye effect)
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
                        return wall;
                    }
                }
            }
        }
        return null;
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
