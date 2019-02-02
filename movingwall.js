class MovingWall extends Tile {
    
    constructor(x, y, type, length, velocity, vertical, numberOfBlocksToMove) {
        super(x, y, type, length, false);
        if (vertical) {
            this.end = new Vector(this.position.x, this.position.y + this.length * numberOfBlocksToMove);
        } else {
            this.end = new Vector(this.position.x + this.length * numberOfBlocksToMove, this.position.y);
        }
        this.start = this.position.clone();
        this.to = this.end.clone();
        this.velocity = new Vector(velocity, velocity);
        this.colImage = "invisible";
        this.rowImage = "invisible";
        this.animation = new Animation(13, 1);
        this.animation.stopAtSequenceNumber(1, null);
        this.blinkTime = 0;
        this.blinkTimeLimit = Math.random() * 2;
    }
    
    update(dt) {
        if (this.animation.isStopped()) {
            this.blinkTime += dt;
            if (this.blinkTime >= this.blinkTimeLimit) {
                this.blinkTimeLimit = Math.random() * 2;
                this.blinkTime = 0;
                this.animation.reset();
            }
        }
        
        this.animation.update(dt);
        var x = Math.abs(player.position.x - this.position.x);
        var y = Math.abs(player.position.y - this.position.y);
        var size = this.length / 2 + player.length / 2;
        if (x <= size && y <= size) {
            player.kill();
        }
        
        var sub = this.to.sub(this.position);
        if (sub.x > 0) {
            this.position.x += this.velocity.x * dt;
        } else {
            this.position.x -= this.velocity.x * dt;
        }
        if (sub.y > 0) {
            this.position.y += this.velocity.y * dt;
        } else {
            this.position.y -= this.velocity.y * dt;
        }
        
        if (sub.dot(sub) <= 10) {
            var tmp = this.start.sub(this.to);
            if (tmp.dot(tmp) > 2) {
                this.to = this.start.clone();
            } else {
                this.to = this.end.clone();
            }
        }
    }
    
    renderRaycaster(context, data) {
        var halfY = outputHeight / 2;
        var height = this.length / data.z * distToPlane;
        var image = data.imageType === COL_TYPE_IMAGE ? this.colImage : this.rowImage;
        image = image + (this.animation.getFrame() + 1);
        context.drawImage(
            this.assets.spritesAtlas, 
            parseInt(this.atlas.sprites[image].x) + parseInt(data.pixel),
            this.atlas.sprites[image].y,
            1,
            this.atlas.sprites[image].height,
            data.x,
            halfY - height / 2,
            pixelWidth,
            height);
        // Fog
        var ratio = data.z / 500;
        context.fillStyle = "rgba(0,0,0," + ratio + ")";
        context.fillRect(data.x, halfY - height / 2, pixelWidth, height);
    }
}
