class MovingWall extends Tile {
    
    constructor(x, y, type, length) {
        super(x, y, type, length, false);
        this.end = new Vector(this.position.x, this.position.y + this.length);
        this.start = this.position.clone();
        this.to = this.end.clone();
        this.velocity = new Vector(10, 10);
        this.colImage = "radioactive";
        this.rowImage = "radioactive";
    }
    
    update(dt) {
        
        var x = Math.abs(player.position.x - this.position.x);
        var y = Math.abs(player.position.y - this.position.y);
        var size = this.length / 2 + player.length / 2;
        if (x <= size && y <= size) {
            player.kill();
        }
        
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
        
        if (sub.dot(sub) <= 2) {
            var tmp = this.start.sub(this.to);
            if (tmp.dot(tmp) > 2) {
                this.to = this.start.clone();
            } else {
                this.to = this.end.clone();
            }
        }
    }
}
