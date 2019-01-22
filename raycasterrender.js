class RaycasterRender {
    
    constructor() {
        this.data = [];
    }
    
    render(context, fps) {
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
    }
}


