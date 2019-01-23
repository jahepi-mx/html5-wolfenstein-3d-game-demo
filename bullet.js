class Bullet {
    
    constructor(position, direction) {
        this.moves = [[0, 0], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
        this.position = position;
        this.position.addThis(direction.mul(map.tileLength / 2));
        this.velocity = direction.mul(240);
        this.length = 10;
        this.collided = false;
        this.dispose = false;
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
        this.fireExplosionAnimation = new Animation(2, 5);
        this.fireExplosionAnimation.stopAtSequenceNumber(1, null);
    }
    
    update(dt) {
        
        if (this.collided) {
            this.fireExplosionAnimation.update(dt);
            if (this.fireExplosionAnimation.isStopped()) {
                this.dispose = true;
            }
            return;
        }
        
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
    
    renderRaycaster(context, data) {
        /*var halfY = outputHeight / 2;
        context.fillStyle = "#ffe8e8";
        var len = this.length / data.z * distToPlane;
        context.fillRect(data.x - len / 2, halfY - len / 2, len, len);
        */
        var halfY = outputHeight / 2;
        var frame = "new_bullet";
        var len = 0;
        if (this.collided) {
            len = this.length * 3 / data.z * distToPlane;
            frame = "new_bullet_explo_" + (this.fireExplosionAnimation.getFrame() + 1);
        } else {
            len = this.length / data.z * distToPlane;
        }
        
        context.drawImage(
            this.assets.spritesAtlas, 
            this.atlas.sprites[frame].x,
            this.atlas.sprites[frame].y,
            this.atlas.sprites[frame].width,
            this.atlas.sprites[frame].height,
            data.x - len / 2,
            halfY - len / 2,
            len,
            len);
    }
}