class Boss {
    
    constructor(x, y, velocity, map, shootTimeLimit, life) {
        this.map = map;
        this.length = 25;
        this.moves = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        this.position = new Vector(map.tileLength * x + map.tileLength / 2, map.tileLength * y + map.tileLength / 2);
        this.velocity = new Vector(0, 0);
        this.velocityTmp = new Vector(velocity, velocity);
        this.searchTime = 0;
        this.searchTimeLimit = 2;
        this.path = [];
        this.pathTo = null;
        this.bullets = [];
        this.shootTime = 0;
        this.shootTimeLimit = shootTimeLimit === 0 ? 2 : shootTimeLimit;
        this.searchDoorTime = 0;
        this.searchDoorTimeLimit = 0.5;
        this.damageTimeLimit = 0.2;
        this.damageTime = this.damageTimeLimit;
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
        this.runAnimation = new Animation(5, 2);
        this.deadAnimation = new Animation(7, 1);
        this.deadAnimation.stopAtSequenceNumber(1, null);
        this.fireAnimation = new Animation(3, 2);
        this.fireAnimation.stopAtSequenceNumber(3, null);
        this.fireAnimation.stop();
        this.life = life;
        this.isDead = false;
        this.dispose = false;
        this.randomShootTime = 0;
        this.randomShootTimeLimit = Math.random() * 3;
        this.speakingTime = 0;
        this.speakingTimeLimit = 4;
    }
    
    update(dt) {
        
        if (this.isDead) {
            this.deadAnimation.update(dt);
            this.bullets = [];
            return;
        }
        this.speakingTime += dt;
        this.randomShootTime += dt;
        this.searchTime += dt;
        if (this.searchTime > this.searchTimeLimit && this.fireAnimation.isStopped()) {
            this.path = [];
            this.pathfinding();
            this.searchTime = 0;
        }
        this.damageTime += dt;
        this.searchDoorTime += dt;
        if (this.searchDoorTime > this.searchDoorTimeLimit) {
            var currX = parseInt(this.position.x / this.map.tileLength);
            var currY = parseInt(this.position.y / this.map.tileLength);
            for (let move of this.moves) {
                var currXTmp = currX + move[0];
                var currYTmp = currY + move[1];
                if (currXTmp >= 0 && currXTmp < this.map.width && currYTmp >= 0 && currYTmp < this.map.height) {
                    var door = this.map.tiles[currYTmp * this.map.width + currXTmp];
                    if (door.type === MAP_DOOR_COL || door.type === MAP_DOOR_ROW) {
                        door.open();
                    }
                }
            }
            this.searchDoorTime = 0;
        }
        
        var playerVector = player.position.sub(this.position);
        this.shootTime += dt;
        if (playerVector.dot(playerVector) <= 30000 
                || this.randomShootTime >= this.randomShootTimeLimit) {
            this.path = [];
            this.pathTo = null;
            this.velocity.mulThis(0);
            this.randomShootTime = 0;
            this.randomShootTimeLimit = Math.random() * 5;

            if (this.shootTime >= this.shootTimeLimit) {               
                var saySomething = Math.random() * 10;
                if (saySomething > 5) {
                    if (this.speakingTime >= this.speakingTimeLimit) { 
                        this.speakingTime = 0;
                        var volume = (1 - (playerVector.dot(playerVector) / 2000000)) * 0.1;
                        this.assets.playAudio(Math.random() < 0.5 ? this.assets.diemf : this.assets.laugh, false, volume);
                    }
                }
                this.assets.playAudio(this.assets.gunshotboss, false, 0.1);
                var diff = player.position.sub(this.position);
                var radians = diff.getAngle();
                var bullet = new Bullet(this.position.clone(), new Vector(1, 0).setUnitAngle(radians + Math.PI / 8))
                bullet.image = "enemy_bullet";
                this.bullets.push(bullet);
                var bullet = new Bullet(this.position.clone(), new Vector(1, 0).setUnitAngle(radians));
                bullet.image = "enemy_bullet";
                this.bullets.push(bullet);
                var bullet = new Bullet(this.position.clone(), new Vector(1, 0).setUnitAngle(radians - Math.PI / 8))
                bullet.image = "enemy_bullet";
                this.bullets.push(bullet);
                this.shootTime = 0;
                this.fireAnimation.reset();
            }
        }
        
        if (this.path.length > 0 && this.pathTo === null) {
            this.pathTo = this.path.pop();
        }
        
        if (this.pathTo !== null) {
            var translate = this.pathTo.sub(this.position);
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
        
        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            this.runAnimation.update(dt);
        }
        if (!this.fireAnimation.isStopped()) {
            this.fireAnimation.update(dt);
        }
        
        for (var a = this.bullets.length - 1; a >= 0; a--) {
            var bullet = this.bullets[a];
            bullet.update(dt);
            if (bullet.dispose) {
                this.bullets.splice(a, 1);
            } else {
                var diff = player.position.sub(bullet.position);
                var size = player.length / 2 + this.length / 2;
                if (!bullet.collided && Math.abs(diff.x) <= size && Math.abs(diff.y) <= size) {
                    bullet.collided = true;
                    player.damage();
                }
            }
        }
    }
    
    damage() {
        this.life--;
        this.damageTime = 0;
        if (this.life <= 0) {
            this.assets.playAudio(this.assets.bossdie, false, 0.1);
            this.life = 0;
            this.isDead = true;
        }
    }
    
    pathfinding() {
        var map = this.map;
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
    
    render(context) {
        context.fillStyle = "#f1f1f1";
        context.fillRect(origX + (this.position.x - this.length / 2), origY - (this.position.y + this.length / 2), this.length, this.length);
        
        context.strokeStyle = "#111";
        context.beginPath();
        context.moveTo(origX + this.position.x, origY - this.position.y);
        //var dirPos = this.directionVectorFrom.mul(10);
        //context.lineTo(origX + (this.position.x + dirPos.x), origY - (this.position.y + dirPos.y));
        //context.stroke();
        
        for (let bullet of this.bullets) {
            bullet.render(context);
        }
    }
    
    renderRaycaster(context, data) {
        var map = this.map;
        var image = "";
        var isDamaged = this.damageTime < this.damageTimeLimit;
        if (this.isDead) {
            image = "BOSS_DEAD_" + (this.deadAnimation.getFrame() + 1);
        } else if (!this.fireAnimation.isStopped()) {
            image = (isDamaged ? "RED_BOSS_ATTACK_" : "BOSS_ATTACK_") + (this.fireAnimation.getFrame() + 1);
        } else if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            image = (isDamaged ? "RED_BOSS_RUN_" : "BOSS_RUN_") + (this.runAnimation.getFrame() + 1);
        } else {
            image = (isDamaged ? "RED_BOSS" : "BOSS");
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

