class Door extends Tile {
    constructor(x, y, type, length) {
        super(x, y, type, length, false);
        this.openRange = new Vector(0, 0);
        this.velocity = new Vector(20, 0);
        this.openBool = false;
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
    }
    
    update(dt) {
        
        if (this.openBool) {
            this.openRange.addThis(this.velocity.mul(dt * 3));
            if (this.openRange.x > 100) {
                this.openRange.x = 100;
                this.walkable = true;
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
        var image = "tile49";
        var offset = parseInt(this.length * this.openRange.x / 100);
        context.drawImage(
            this.assets.spritesAtlas, 
            parseInt(this.atlas.sprites[image].x) + parseInt(data.pixel) - offset,
            this.atlas.sprites[image].y,
            1,
            this.atlas.sprites[image].height,
            data.x,
            halfY - height / 2,
            pixelWidth,
            height);
    }
}