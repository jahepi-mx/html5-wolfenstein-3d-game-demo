class Player {
    constructor(x, y, length) {
        this.moves = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
        this.length = length;
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.velocityLength = new Vector(105, 105).length();
        this.friction = 0.90;
        this.totalFriction = Math.pow(this.friction, 60);
        this.rotation = Math.PI;
        this.radianStep = Math.PI / 2;
        this.rotateLeftBool = false;
        this.rotateRightBool = false;
        this.forwardBool = false;
        this.backwardBool = false;
        this.openDoorBool = false;
        this.shootBool = false;
        this.shootTime = 0;
        this.shootTimeLimit = 0.3;
        this.bullets = [];
        this.playerDirection = new Vector(Math.cos(this.rotation), Math.sin(this.rotation));
        this.viewDirection = new Vector(this.playerDirection.x, this.playerDirection.y);
        this.isShooting = false;
        this.takingLifeLimit = 0.1;
        this.takingLife = this.takingLifeLimit;
        this.damageLifeLimit = 0.1;
        this.damageLife = this.takingLifeLimit;
        this.life = 20;
        this.maxLife = this.life;
        this.isDead = false;
        this.assets = Assets.getInstance();
    }
    
    setViewDirection(radians) {
        this.rotation = radians;
        this.playerDirection = new Vector(Math.cos(radians), Math.sin(radians));
        this.viewDirection = new Vector(this.playerDirection.x, this.playerDirection.y);
    }
    
    update(dt) {
        
        if (this.isDead) {
            return;
        }
        
        this.takingLife += dt;
        this.damageLife += dt;
        this.isShooting = false;
        this.shootTime += dt;
        if (this.shootTime >= this.shootTimeLimit && this.shootBool) {
            this.assets.playAudio(this.assets.gunshot, false, 0.1);
            this.bullets.push(new Bullet(this.position.clone(), new Vector(this.viewDirection.x, this.viewDirection.y)));
            this.shootTime = 0;
            this.isShooting = true;
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
        
        var fps = 1 / dt;
        var currentFriction = Math.pow(this.totalFriction, 1 / fps);
        this.velocity.mulThis(currentFriction);
        
        for (var a = this.bullets.length - 1; a >= 0; a--) {
            var bullet = this.bullets[a];
            bullet.update(dt);
            if (bullet.dispose) {
                this.bullets.splice(a, 1);
            } else {
                for (let enemy of map.enemies) {
                    if (!enemy.isDead) {
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
        
        for (var a = map.items.length - 1; a >= 0; a--) {
            var item = map.items[a];
            item.update(dt);
            if (item.dispose) {
                map.items.splice(a, 1);
            } else {
                var diff = item.position.sub(this.position);
                var size = item.length / 2;
                if (Math.abs(diff.x) <= size && Math.abs(diff.y) <= size) {
                    item.dispose = true;
                    this.takingLife = 0;
                    this.life++;
                    this.assets.playAudio(this.assets.life, false, 0.2);
                }
            }
        }
    }
    
    isTakingLife() {
        return this.takingLife < this.takingLifeLimit;
    }
    
    isDamageLife() {
        return this.damageLife < this.damageLifeLimit;
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
    
    damage() {
        this.life--;
        this.damageLife = 0;
        if (this.life <= 0) {
            this.life = 0;
            this.isDead = true;
        }
    }
    
    kill() {
        this.life = 0;
        this.damageLife = 0;
        this.isDead = true;
    }
    
    reset() {
        this.velocity = new Vector(0, 0);
        this.rotation = 0;
        this.rotateLeftBool = false;
        this.rotateRightBool = false;
        this.forwardBool = false;
        this.backwardBool = false;
        this.openDoorBool = false;
        this.shootBool = false;
        this.shootTime = 0;
        this.bullets = [];
        this.playerDirection = new Vector(0, 0);
        this.viewDirection = new Vector(0, 0);
        this.isShooting = false;
        this.takingLifeLimit = 0.1;
        this.takingLife = this.takingLifeLimit;
        this.life = this.maxLife;
        this.isDead = false;
    }
}

