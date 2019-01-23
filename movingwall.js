class MovingWall extends Tile {
    
    constructor(x, y, type, length) {
        super(x, y, type, length, false);
        this.end = new Vector(this.position.x + length * 2, this.position.y);
        this.start = this.position.clone();
        this.to = this.end.clone();
        this.velocity = new Vector(10, 10);
    }
    
    update(dt) {
        
        var sub = this.to.sub(this.position);
        if (sub.x > 0) {
            this.position.x += this.velocity.x * dt;
        } else {
            this.position.x -= this.velocity.x * dt;
        }
        if (sub.y > 0) {
            this.position.y += this.velocity.y * dt;
        } else {
            this.position.y -= this.velocity.y * dt;
        }
        
        if (sub.dot(sub) <= 100) {
            var tmp = this.start.sub(this.to);
            if (tmp.dot(tmp) > 100) {
                this.to = this.start.clone();
            } else {
                this.to = this.end.clone();
            }
        }
    }
}
