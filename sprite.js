class Sprite {
    
    constructor(x, y, length) {
        this.position = new Vector(x, y);
        this.length = length;
    }
    
    update(dt) {
        
    }
    
    render(context) {
        context.fillStyle = "#ccc";
        context.fillRect(origX + (this.position.x - this.length / 2), origY - (this.position.y + this.length / 2), this.length, this.length);
    }
}