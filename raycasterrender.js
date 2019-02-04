class RaycasterRender {
    
    constructor() {
        this.data = [];
        this.atlas = Atlas.getInstance();
        this.assets = Assets.getInstance();
        this.fireAnimation = new Animation(4, 4);
        this.fireAnimation.stopAtSequenceNumber(1, null);
        this.fireAnimation.stop();
        this.lifeWidth = 200;
        this.origLifeWidth = this.lifeWidth;
    }
    
    render(context, dt, fps) {
        context.imageSmoothingEnabled = false;
        
        context.clearRect(0, 0, outputWidth, outputHeight);
        
        context.fillStyle = map.ceilingColor;
        context.fillRect(0, 0, outputWidth, outputHeight / 2);
        context.fillStyle = map.floorColor;
        context.fillRect(0, outputHeight / 2, outputWidth, outputHeight / 2);
        for (let data of this.data) {
            data.object.renderRaycaster(context, data);
        }
        context.fillStyle = "#00ff00";
        context.font = "30px joystix";
        context.fillText(fps, outputWidth - 30, 30);
        
        if (player.isShooting && this.fireAnimation.isStopped()) {
            this.fireAnimation.reset();
        }
        if (!this.fireAnimation.isStopped()) {
            this.fireAnimation.update(dt);
        }
        
        var frame = "gun";
        
        if (!this.fireAnimation.isStopped()) {
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
        
        if (player.isTakingLife()) {
            context.fillStyle = "rgba(255,255,255,0.5)";
            context.fillRect(0, 0, outputWidth, outputHeight);
        }
        
        context.fillStyle = "#fff";
        context.font = "30px joystix";
        context.fillText("LIFE", 30, 30);
        
        context.fillStyle = "#ff0000";
        
        var currWidth = player.life / player.maxLife * this.origLifeWidth;
        this.lifeWidth += (currWidth - this.lifeWidth) * dt; 
        context.fillRect(80, 13, this.lifeWidth, 20);
        
        if (player.isDamageLife() || player.isDead) {
            context.fillStyle = "rgba(255,0,0,0.5)";
            context.fillRect(0, 0, outputWidth, outputHeight);  
        }
        
        if (player.isDead) {
            context.fillStyle = "#fff";
            context.font = "50px joystix";
            context.fillText("YOU DIED. PRESS R TO RESTART LEVEL", outputWidth / 2, outputHeight / 2);
        }
    }
    
    reset() {
        this.data = [];
        this.fireAnimation = new Animation(4, 4);
        this.fireAnimation.stopAtSequenceNumber(1, null);
        this.fireAnimation.stop();
        this.lifeWidth = this.origLifeWidth;
    }
}


