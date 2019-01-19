class Tile {
    constructor(x, y, type, length, walkable) {
        this.length = length;
        this.position = new Vector(this.length * x + this.length / 2, this.length * y + this.length / 2);
        this.mapPosition = new Vector(x, y);
        this.walkable = walkable;
        this.type = type;
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
    }
    
    update(dt) {
        
    }
    
    render(context) {
        context.strokeStyle = "#f3f3f3";
        context.fillStyle = this.walkable ? "#fff" : "#f1f1f1";
        if (this.walkable) {
            context.strokeRect(origX + (this.position.x - this.length / 2), origY - (this.position.y + this.length / 2), this.length, this.length);
        } else {
            context.fillRect(origX + (this.position.x - this.length / 2), origY - (this.position.y + this.length / 2), this.length, this.length);
        }
    }
    
    renderRaycaster(context, data) {
        var halfY = outputHeight / 2;
        var height = this.length / data.z * distToPlane;
        var image = "tile22";
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
    }
}


