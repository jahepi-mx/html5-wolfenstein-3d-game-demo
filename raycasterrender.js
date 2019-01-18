class RaycasterRender {
    
    constructor() {
        this.data = [];
    }
    
    render(context) {
        context.clearRect(0, 0, outputWidth, outputHeight);
        //context.fillText(fps, outputWidth - 10, 10);

        for (let data of this.data) {
            var halfY = outputHeight / 2;
            if (data.door) {
                var h = 30 / data.z * distToPlane;
                context.fillStyle = "#d8d8d8";
                context.fillRect(data.x, halfY - h / 2, pixelWidth, h);
            } else if (data.sprite === null) {
                var h = 30 / data.z * distToPlane;
                context.fillStyle = "#f1f1f1";
                context.fillRect(data.x, halfY - h / 2, pixelWidth, h);
            } else {
                context.fillStyle = "#ffe8e8";
                var len = 10 / data.z * distToPlane;
                context.fillRect(data.x - len / 2, halfY - len / 2, len, len);
            }
        }
    }
}


