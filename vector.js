class Vector {
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    
    addThis(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }
    
    sub(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
    
    mul(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    
    mulThis(scalar) {
        this.x *= scalar; 
        this.y *= scalar;
    }
    
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    setLength(length) {
        var angle = this.getAngle();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }
    
    normalize() {
        var length = this.length();
        return new Vector(this.x / length, this.y / length);
    }
    
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    
    getAngle() {
        return Math.atan2(this.y, this.x);
    }
    
    setAngle(radians) {
        var length = this.length();
        this.x = Math.cos(radians) * length;
        this.y = Math.sin(radians) * length;
        return this;
    }
    
    setUnitAngle(radians) {
        this.x = Math.cos(radians);
        this.y = Math.sin(radians);
        return this;
    }
    
    addAngle(radians) {
        var length = this.length();
        var angle = this.getAngle() + radians;
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
        return this;
    }
    
    equals(vector) {
        return this.x === vector.x && this.y === vector.y;
    }
    
    clone() {
        return new Vector(this.x, this.y);
    }
}

