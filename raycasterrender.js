class RaycasterRender {
    
    constructor() {
        this.data = [];
    }
    
    render(context, fps) {
        context.clearRect(0, 0, outputWidth, outputHeight);
        context.fillText(fps, outputWidth - 10, 10);
        
        for (let data of this.data) {
            data.object.renderRaycaster(context, data);
        }
    }
}


