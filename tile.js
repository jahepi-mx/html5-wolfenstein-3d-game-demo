class Tile {
    constructor(x, y, length, walkable) {
        this.length = length;
        this.position = new Vector(x, y);
        this.walkable = walkable;
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
}


