class Door {
    constructor(x, y, length, type) {
        this.type = type;
        this.length = length;
        this.position = new Vector(this.length * x + this.length / 2, this.length * y + this.length / 2);
        this.mapPosition = new Vector(x, y);
        this.openRange = new Vector(0, 0);
        this.velocity = new Vector(20, 0);
    }
    
    update(dt) {
        
        this.openRange.addThis(this.velocity.mul(dt));
        if (this.openRange.x > 100) {
            this.openRange.x = 100;
            this.velocity.mulThis(-1);
        }
        
        if (this.openRange.x < 0) {
            this.openRange.x = 0;
            this.velocity.mulThis(-1);
        }
    }
    
    isPixelVisible(vector) {
        if (this.type === 2) {
            var pos = vector.y % this.length;
            pos = pos / this.length * 100;
            if (pos >= this.openRange.x) {
                return true;
            }
        }
        if (this.type === 3) {
            var pos = vector.x % this.length;
            pos = pos / this.length * 100;
            if (pos >= this.openRange.x) {
                return true;
            }
        }
        return false;
    }
    
    render(context) {
        
    }
}