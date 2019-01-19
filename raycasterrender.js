class RaycasterRender {
    
    constructor() {
        this.data = [];
    }
    
    render(context, fps) {
        context.clearRect(0, 0, outputWidth, outputHeight);
        context.fillText(fps, outputWidth - 10, 10);
        var atlas = Atlas.getInstance();
        var assets = Assets.getInstance();
        
        for (let data of this.data) {
            var halfY = outputHeight / 2;
            if (data.door) {
                var h = 32 / data.z * distToPlane;
                //context.fillStyle = "#d8d8d8";
                //context.fillRect(data.x, halfY - h / 2, pixelWidth, h);
                var image = "tile49";
                var offset = parseInt(32 * data.obj.openRange.x / 100);
                context.drawImage(
                    assets.spritesAtlas, 
                    parseInt(atlas.sprites[image].x) + parseInt(data.pixel) - offset,
                    atlas.sprites[image].y,
                    1,
                    atlas.sprites[image].height,
                    data.x,
                    halfY - h / 2,
                    pixelWidth,
                    h);
            } else if (data.sprite === null) {
                var h = 32 / data.z * distToPlane;
                //context.fillStyle = "#f1f1f1";
                //context.fillRect(data.x, halfY - h / 2, pixelWidth, h);
                var image = "tile22";
                context.drawImage(
                    assets.spritesAtlas, 
                    parseInt(atlas.sprites[image].x) + parseInt(data.pixel),
                    atlas.sprites[image].y,
                    1,
                    atlas.sprites[image].height,
                    data.x,
                    halfY - h / 2,
                    pixelWidth,
                    h);
            } else {
                context.fillStyle = "#ffe8e8";
                var len = 10 / data.z * distToPlane;
                context.fillRect(data.x - len / 2, halfY - len / 2, len, len);
            }
        }
    }
}


