class Sprite extends Tile {
    
    constructor(x, y, type, length, walkable) {
        super(x, y, type, length, walkable);
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
        this.fireAnimation = new Animation(4, 2);
    }
    
    update(dt) {
        this.fireAnimation.update(dt);
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
        var frame = "torch" + (this.fireAnimation.getFrame() + 1);
        var halfY = outputHeight / 2;
        var length = this.length;
        var height = length / data.z * distToPlane;
        context.drawImage(
            this.assets.spritesAtlas, 
            this.atlas.sprites[frame].x,
            this.atlas.sprites[frame].y,
            this.atlas.sprites[frame].width,
            this.atlas.sprites[frame].height,
            data.x - height / 2,
            halfY - height / 2,
            height,
            height);
    }
}