class Enemy {
    
    constructor(x, y) {
        this.length = 25;
        this.moves = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        this.position = new Vector(map.tileLength * x + map.tileLength / 2, map.tileLength * y + map.tileLength / 2);
        this.velocity = new Vector(0, 0);
        this.velocityTmp = new Vector(20, 20);
        this.directionVectorFrom = new Vector(1, 0);
        this.directionVectorTo = new Vector(0, 0);
        this.searchTime = 0;
        this.searchTimeLimit = 1;
        this.path = [];
        this.pathTo = null;
        this.bullets = [];
        this.shootTime = 0;
        this.shootTimeLimit = 1;
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
        this.runAnimation = new Animation(4, 2);
        this.fireAnimation = null;
    }
    
    update(dt) {
        this.searchTime += dt;
        if (this.searchTime > this.searchTimeLimit) {
            this.path = [];
            this.pathfinding();
            this.searchTime = 0;
        }
        
        var playerVector = player.position.sub(this.position);
        if (playerVector.dot(playerVector) <= 1000) {
            this.path = [];
            this.pathTo = null;
            this.velocity.mulThis(0);
            this.directionVectorTo = playerVector;
            this.shootTime += dt;
            if (this.shootTime >= this.shootTimeLimit) {
                this.bullets.push(new Bullet(this.position.clone(), new Vector(1, 0).setUnitAngle(this.directionVectorFrom.getAngle())));
                this.shootTime = 0;
                this.fireAnimation = new Animation(4, 1);
                this.fireAnimation.stopAtSequenceNumber(1, null);
            }
        } else {
            this.shootTime = 0;
        }
        
        this.calculateDirection(dt);
        
        if (this.path.length > 0 && this.pathTo === null) {
            this.pathTo = this.path.pop();
        }
        
        if (this.pathTo !== null) {
            var translate = this.pathTo.sub(this.position);
            this.directionVectorTo = translate;
            if (translate.dot(translate) <= 10) {
                if (this.path.length > 0) {
                    this.pathTo = this.path.pop();
                } else {
                    this.velocity.mulThis(0);
                }
            } else {
                var margin = 2;
                if (translate.y < -margin) {
                    this.velocity.y = -this.velocityTmp.y;
                } else if (translate.y > margin) {
                    this.velocity.y = this.velocityTmp.y;
                } else {
                    this.velocity.y = 0;
                }
                
                if (translate.x < -margin) {
                    this.velocity.x = -this.velocityTmp.x;
                } else if (translate.x > margin) {
                    this.velocity.x = this.velocityTmp.x;
                } else {
                    this.velocity.x = 0;
                }
            }
        }
        this.position.addThis(this.velocity.mul(dt));
        
        for (var a = this.bullets.length - 1; a >= 0; a--) {
            var bullet = this.bullets[a];
            bullet.update(dt);
            if (bullet.collided) {
                this.bullets.splice(a, 1);
            }
        }
        
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.runAnimation.update(dt);
        }
        if (this.fireAnimation !== null) {
            this.fireAnimation.update(dt);
        }
    }
    
    pathfinding() {
        var fromX = parseInt(this.position.x / map.tileLength);
        var fromY = parseInt(this.position.y / map.tileLength);
        var fromTile = map.tiles[fromY * map.width + fromX];
        var toX = parseInt(player.position.x / map.tileLength);
        var toY = parseInt(player.position.y / map.tileLength);
        var toTile = map.tiles[toY * map.width + toX];
        var queue = new PriorityQueue(function (a, b) {
            return a.priority > b.priority;
        });
        var parents = [];
        var visited = [];
        var toTileFound = false;
        visited[fromY * map.width + fromX] = 1;
        queue.add(fromTile, 0);
        out: while (!queue.isEmpty()) {
            var tile = queue.remove().object;     
            for (let move of this.moves) {
                var newTileX = tile.mapPosition.x + move[0];
                var newTileY = tile.mapPosition.y + move[1];
                if (newTileX >= 0 && newTileX < map.width && newTileY >= 0 && newTileY < map.height) {
                    var nextTile = map.tiles[newTileY * map.width + newTileX];
                    if (visited[newTileY * map.width + newTileX] !== 1 && nextTile.walkable) {
                        visited[newTileY * map.width + newTileX] = 1;
                        parents[newTileY * map.width + newTileX] = tile.mapPosition.y * map.width + tile.mapPosition.x;
                        if (nextTile.mapPosition.equals(toTile.mapPosition)) {
                            toTileFound = true;
                            break out;
                        } else {
                            var diff = player.position.sub(nextTile.position);
                            var heuristic = Math.abs(diff.x) + Math.abs(diff.y);
                            queue.add(nextTile, heuristic);
                        }
                    }
                }
            }
        }
        if (toTileFound) {
            this.path = [];
            var index = toTile.mapPosition.y * map.width + toTile.mapPosition.x;
            while (parents[index] !== undefined) {
                this.path.push(map.tiles[index].position);
                index = parents[index];
            }
            //this.path.push(map.tiles[index].position);
        }
    }
    
    calculateDirection(dt) {
        var from = this.directionVectorFrom.getAngle();
        var to = this.directionVectorTo.getAngle();
        var diff = Math.abs(to - from);
        if (to < 0 && from > 0) {
            var tmp = Math.abs((to + Math.PI * 2) - from);
            if (tmp < diff) to += Math.PI * 2;
        }
        if (to > 0 && from < 0) {
            var tmp = Math.abs(to - (from + Math.PI * 2));
            if (tmp < diff) from += Math.PI * 2;
        }
        from += (to - from) * (dt * 4);
        this.directionVectorFrom.setAngle(from);
    }
    
    render(context) {
        context.fillStyle = "#f1f1f1";
        context.fillRect(origX + (this.position.x - this.length / 2), origY - (this.position.y + this.length / 2), this.length, this.length);
        
        context.strokeStyle = "#111";
        context.beginPath();
        context.moveTo(origX + this.position.x, origY - this.position.y);
        var dirPos = this.directionVectorFrom.mul(10);
        context.lineTo(origX + (this.position.x + dirPos.x), origY - (this.position.y + dirPos.y));
        context.stroke();
        
        for (let bullet of this.bullets) {
            bullet.render(context);
        }
    }
    
    getSpriteAngle() {
        /*
         To see in which angle is the enemy sprite related to the player view direction,
         We took first the direction where the player is pointing out (directionVectorFrom), this is the vector which is the viewing direction.
         It is our X basis vector, and the Y basis vector can be derived from the following matrix:
           x     y
          [cos, -sin
           sin, cos]
        
        We transpose the matrix to transform from World Coordinates to Local coordinates in relation to the basis vectors: 
            x     y
          [cos,  sin
           -sin, cos]
         
        Convert the world coordinates to local:
        x = x * cos + y * sin;
        y = x * -sin + y * cos;
        
        Finally get the angle from the obtained vector to know in which angle the sprite should be rendered.
         */
        var rad = player.rotation;
        var cos = Math.cos(rad);
        var sin = Math.sin(rad);
        var localX = this.directionVectorFrom.x * cos + this.directionVectorFrom.y * sin;
        var localY = this.directionVectorFrom.x * -sin + this.directionVectorFrom.y * cos;
        
        var newRad = Math.atan2(localY, localX);
        if (newRad < 0) {
            newRad += Math.PI * 2;
        }
        var degrees = 180 / Math.PI * newRad;
        
        if (degrees >= 338 || degrees < 23) return 0;
        if (degrees >= 23 && degrees < 68) return 45;
        if (degrees >= 68 && degrees < 113) return 90;
        if (degrees >= 113 && degrees < 158) return 135;
        if (degrees >= 158 && degrees < 203) return 180;
        if (degrees >= 203 && degrees < 248) return 225;
        if (degrees >= 248 && degrees < 293) return 270;
        if (degrees >= 293 && degrees < 338) return 315;
        return 0;
    }
    
    renderRaycaster(context, data) {
        /*var halfY = outputHeight / 2;
        context.fillStyle = "#ffe8e8";
        var len = this.length  / data.z * distToPlane;
        context.fillRect(data.x - len / 2, halfY - len / 2, len, len);*/
        var image = "";
        var angle = this.getSpriteAngle();
        if (this.fireAnimation !== null && !this.fireAnimation.isStopped()) {
            image = "SS_FIRE_" + (this.fireAnimation.getFrame() + 1);
        } else if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            image = "SS_RUN_" + angle + "_" + (this.runAnimation.getFrame() + 1);
        } else {
            image += "SS_" + angle;
        }
        
        var halfY = outputHeight / 2;
        var length = map.tileLength;
        var height = length / data.z * distToPlane;
        context.drawImage(
            this.assets.spritesAtlas, 
            this.atlas.sprites[image].x,
            this.atlas.sprites[image].y,
            this.atlas.sprites[image].width,
            this.atlas.sprites[image].height,
            data.x - height / 2,
            halfY - height / 2,
            height,
            height);
    }
}

