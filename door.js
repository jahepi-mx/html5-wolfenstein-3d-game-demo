class Door extends Tile {
    constructor(x, y, type, length) {
        super(x, y, type, length, false);
        this.openRange = new Vector(0, 0);
        this.velocity = new Vector(20, 0);
        this.openBool = false;
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
        this.image = "door";
        this.closeTime = 2;
        this.closeTimeCount = 0;
        this.isClosingCountdown = false;
        this.isMakingNoise = false;
    }
    
    update(dt) {
        if (this.isClosingCountdown) {
            this.closeTimeCount += dt;
            if (this.closeTimeCount >= this.closeTime) {
                // Check if the player is nearby
                var success = true;
                var diff = player.position.sub(this.position);
                if (diff.dot(diff) <= 1000) {
                    success = false;
                }
                if (success) {
                    this.walkable = false;
                    this.openBool = false;
                    this.isClosingCountdown = false;
                    this.isMakingNoise = false;
                }
            }
        }
        if (this.openBool && !this.isClosingCountdown) {
            if (!this.isMakingNoise) {
                this.assets.playAudio(this.assets.door, false, 1);
                this.isMakingNoise = true;
            }
            this.openRange.addThis(this.velocity.mul(dt * 3));
            if (this.openRange.x >= 100) {
                this.openRange.x = 100;
                this.closeTimeCount = 0;
                this.walkable = true;
                this.isClosingCountdown = true;
            } 
            
        }
        if (!this.openBool) {
            this.openRange.addThis(this.velocity.mul(dt * -3));
            if (this.openRange.x <= 0) {
                this.openRange.x = 0;
            }
        }
    }
    
    open() {
        this.openBool = true;
    }
    
    isPixelVisible(vector) {
        if (this.type === MAP_DOOR_COL) {
            var pos = vector.y % this.length;
            pos = pos / this.length * 100;
            if (pos >= this.openRange.x) {
                return true;
            }
        }
        if (this.type === MAP_DOOR_ROW) {
            var pos = vector.x % this.length;
            pos = pos / this.length * 100;
            if (pos >= this.openRange.x) {
                return true;
            }
        }
        return false;
    }
    
    render(context) {
        context.fillStyle = "#ffe6e6";
        context.fillRect(origX + (this.position.x - this.length / 2), origY - (this.position.y + this.length / 2), this.length, this.length);
    }
    
    renderRaycaster(context, data) {
        var halfY = outputHeight / 2;
        var height = this.length / data.z * distToPlane;
        var offset = parseInt(this.length * this.openRange.x / 100);
        context.drawImage(
            this.assets.spritesAtlas, 
            parseInt(this.atlas.sprites[this.image].x) + parseInt(data.pixel) - offset,
            this.atlas.sprites[this.image].y,
            1,
            this.atlas.sprites[this.image].height,
            data.x,
            halfY - height / 2,
            pixelWidth,
            height);
    }
}