class Raycasting {
    
    constructor(numberOfRays) {
        this.fov = Math.PI / 2; // 90 degrees
        this.numberOfRays = numberOfRays;
        this.radStep = this.fov / (this.numberOfRays - 1);
        this.tileDirs = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
    }
    
    update(dt) {   
    }
    
    renderSprites(context) {  
        for (let sprite of sprites) {  
            var spriteVector = sprite.position.sub(player.position);
            var playerVector = new Vector(100, 0);
            playerVector.setAngle(player.rotation);
            if (spriteVector.dot(playerVector) > 0) {
                this.drawLine(context, player.position, spriteVector.add(player.position), "#cdcdcd");              
                var fov = this.fov / 2;
                var extraFov = 10 * Math.PI / 180 + fov;
                //var vFov1 = playerVector.clone().addAngle(-extraFov);
                var vFov2 = playerVector.clone().addAngle(-fov);
                var vFov3 = playerVector.clone().addAngle(fov);
                var vFov4 = playerVector.clone().addAngle(extraFov);
                //this.drawLine(context, player.position, vFov1.add(player.position), "#cdcdcd");
                //this.drawLine(context, player.position, vFov2.add(player.position), "#cdcdcd");
                this.drawLine(context, player.position, vFov3.add(player.position), "#cdcdcd");
                this.drawLine(context, player.position, vFov4.add(player.position), "#cdcdcd");
                
                // Reflect sprite vector to center vector (center of the fov)
                var spriteLength = spriteVector.length();
                var normSprite = spriteVector.normalize();
                var normCenter = playerVector.normalize();
                var dot = normCenter.dot(normSprite);
                spriteLength *= dot;
                normCenter.mulThis(spriteLength);
                this.drawLine(context, player.position, normCenter.add(player.position), "#00ff00");
                // Center vector from the reflection to the sprite
                var vectorFromCenter = spriteVector.sub(normCenter);
                this.drawLine(context, player.position.add(normCenter), vectorFromCenter.add(player.position).add(normCenter), "#0000ff");
                
                // Get distance inner fow
                var norm = normCenter.normalize(); 
                var angle = norm.dot(vFov3.normalize());
                var len = normCenter.length();
                var innerFovLen = Math.tan(Math.acos(angle)) * len;
                // Get distance outer fow
                //var angle = norm.dot(vFov4.normalize());
                //var outerFovLen = Math.tan(Math.acos(angle)) * len;
                //console.log(innerFovLen + ", " + outerFovLen);
                var center = innerFovLen;
                var fovLineLen = innerFovLen * 2;
                var len = vectorFromCenter.length();
                if (vectorFromCenter.dot(vFov2) > 0) {
                    center += len;
                }
                if (vectorFromCenter.dot(vFov3) > 0) {
                    center -= len;
                }
                console.log(center / fovLineLen);
            }
        }
        
    }
    
    render(context) {
        var radians = player.rotation - this.fov / 2;
        for (var a = 0; a < this.numberOfRays; a++) {
            var minRayLen = 1 << 16; // 16 bit number enough?
            var minVector = null;
            // Direction line
            var vector = new Vector(200, 0);
            vector.setAngle(radians);
            var rayVector = vector.clone()
            vector.addThis(player.position);
            //this.drawLine(context, player.position, vector, "#cdcdcd"); 
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
            if (minVector !== null) {
                // Calculate distance of the ray avoiding distortion (fish eye effect)
                var ray = minVector.sub(player.position);
                var length = ray.length();
                var radDiff = player.rotation - radians;
                var z = Math.cos(radDiff) * length;
                context.fillStyle = "#00ff00";
                context.fillRect(origX + minVector.x, origY - minVector.y, 2, 2);
            }
            radians += this.radStep;
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
    
    drawLine(context, orig, dest, color) {
        context.strokeStyle = color;
        context.beginPath();
        context.moveTo(origX + orig.x, origY - orig.y);
        context.lineTo(origX + dest.x, origY - dest.y);
        context.stroke();
    }
}
