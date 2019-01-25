class Life {
    
    constructor(x, y, length) {
        this.length = length;
        this.position = new Vector(this.length * x + this.length / 2, this.length * y + this.length / 2);
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
        this.dispose = false;
    }
    
    update(dt) {
    }
    
    render(context) {
        context.fillStyle = "#ccc";
        context.fillRect(origX + (this.position.x - this.length / 2), origY - (this.position.y + this.length / 2), this.length, this.length);
    }
    
    renderRaycaster(context, data) {
        var frame = "life";
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