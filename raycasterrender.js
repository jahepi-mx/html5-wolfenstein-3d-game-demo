class RaycasterRender {
    
    constructor() {
        this.data = [];
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
        this.fireAnimation = new Animation(4, 4);
        this.fireAnimation.stopAtSequenceNumber(1, null);
        this.fireAnimation.stop();
    }
    
    render(context, dt, fps) {
        context.imageSmoothingEnabled = false;
        
        context.clearRect(0, 0, outputWidth, outputHeight);
        context.fillStyle = "#222";
        context.fillRect(0, 0, outputWidth, outputHeight / 2);
        context.fillStyle = "#444";
        context.fillRect(0, outputHeight / 2, outputWidth, outputHeight / 2);
        for (let data of this.data) {
            data.object.renderRaycaster(context, data);
        }
        context.fillStyle = "#00ff00";
        context.font = "20px Arial";
        context.fillText(fps, outputWidth - 30, 30);
        
        if (player.isShooting && this.fireAnimation.isStopped()) {
            this.fireAnimation.reset();
        }
        if (this.fireAnimation !== null && !this.fireAnimation.isStopped()) {
            this.fireAnimation.update(dt);
        }
        
        var frame = "gun";
        
        if (this.fireAnimation !== null && !this.fireAnimation.isStopped()) {
            frame = "gun_shot_" + (this.fireAnimation.getFrame() + 1);
        }
        var len = outputWidth * 0.6;
        context.drawImage(
            this.assets.spritesAtlas, 
            this.atlas.sprites[frame].x,
            this.atlas.sprites[frame].y,
            this.atlas.sprites[frame].width,
            this.atlas.sprites[frame].height,
            outputWidth / 2 - len / 2,
            outputHeight - len,
            len,
            len);
    }
}


