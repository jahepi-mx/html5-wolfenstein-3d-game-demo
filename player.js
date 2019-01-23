class Player {
    constructor(x, y, length) {
        this.moves = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
        this.length = length;
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.velocityLength = new Vector(85, 85).length();
        this.friction = 0.90;
        this.rotation = 0;
        this.radianStep = Math.PI / 2;
        this.rotateLeftBool = false;
        this.rotateRightBool = false;
        this.forwardBool = false;
        this.backwardBool = false;
        this.openDoorBool = false;
        this.shootBool = false;
        this.shootTime = 0;
        this.shootTimeLimit = 1;
        this.bullets = [];
        this.playerDirection = new Vector(0, 0);
        this.viewDirection = new Vector(0, 0);
    }
    
    update(dt) {
        
        this.shootTime += dt;
        if (this.shootTime >= this.shootTimeLimit && this.shootBool) {
            this.bullets.push(new Bullet(this.position.clone(), new Vector(1, 0).setUnitAngle(this.rotation)));
            this.shootTime = 0;
        }
            
        if (this.rotateLeftBool) {
            this.rotation += this.radianStep * dt; 
        }
        
        if (this.rotateRightBool) {
            this.rotation -= this.radianStep * dt;
        }
        this.playerDirection.x = Math.cos(this.rotation);
        this.playerDirection.y = Math.sin(this.rotation);
        this.viewDirection.x = this.playerDirection.x;
        this.viewDirection.y = this.playerDirection.y;
        if (this.backwardBool) {
            this.playerDirection.x = Math.cos(this.rotation + Math.PI);
            this.playerDirection.y = Math.sin(this.rotation + Math.PI);
        }
        
        if (this.forwardBool || this.backwardBool) {
            this.velocity = this.playerDirection.mul(this.velocityLength);
        }
        
        if (this.openDoorBool) {
            var x = parseInt(this.position.x / map.tileLength);
            var y = parseInt(this.position.y / map.tileLength);
            for (let move of this.moves) {
                var newX = move[0] + x;
                var newY = move[1] + y;
                if (newX >= 0 && newX < map.width && newY >= 0 && newY < map.height) {
                    var tile = map.tiles[newY * map.width + newX];
                    if (tile instanceof Door && !tile.walkable) {
                        var diff = tile.position.sub(player.position);
                        // Open door if player is facing the door and it is really close to it.
                        if (this.viewDirection.dot(diff) > 0 && diff.dot(diff) <= 1550) {
                            tile.open();
                        }
                    }
                }
            }
        }
        
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
        
        for (var a = this.bullets.length - 1; a >= 0; a--) {
            var bullet = this.bullets[a];
            bullet.update(dt);
            if (bullet.dispose) {
                this.bullets.splice(a, 1);
            } else {
                for (let enemy of enemies) {
                    var diff = enemy.position.sub(bullet.position);
                    var size = enemy.length / 2 + bullet.length / 2;
                    if (!bullet.collided && Math.abs(diff.x) <= size && Math.abs(diff.y) <= size) {
                        bullet.collided = true;
                        enemy.damage();
                    }
                }
            }
        }
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
        
        for (let bullet of this.bullets) {
            bullet.render(context);
        }
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
    
    backward(bool) {
        this.backwardBool = bool;
    }
    
    shoot(bool) {
        this.shootBool = bool;
    }
    
    openDoor(bool) {
        this.openDoorBool = bool;
    }
}

