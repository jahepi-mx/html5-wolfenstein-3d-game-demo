class Raycasting {
    
    constructor(numberOfRays) {
        this.fov = Math.PI / 2; // 90 degrees
        this.numberOfRays = numberOfRays;
        this.radStep = this.fov / (this.numberOfRays - 1);
    }
    
    update(dt) {   
    }
    
    render(context) {
        context.strokeStyle = "#cdcdcd";
        context.fillStyle = "#ccc";
        var radians = player.rotation - this.fov / 2;
        for (var a = 0; a < this.numberOfRays; a++) {     
            // Direction line
            var vector = new Vector(200, 0);
            vector.setAngle(radians);
            var rayVector = vector.clone()
            vector.addThis(player.position);
            context.beginPath();
            context.moveTo(origX + player.position.x, origY - player.position.y);
            context.lineTo(origX + vector.x, origY - vector.y);
            context.stroke();   
            // Calculate ray collision on rows
            var cos = Math.cos(radians);
            var sin = Math.sin(radians);
            for (var y = 0; y <= map.height; y++) {
                var newY = map.tileLength * y - player.position.y;
                var hyp = newY / sin;
                var newX = cos * hyp;
                var vector = new Vector(newX, newY);
                // Vector has the same direction as the ray
                var dot = vector.dot(rayVector);
                if (dot > 0) {
                    vector.addThis(player.position);
                    context.fillRect(origX + vector.x, origY - vector.y, 2, 2);
                }
            }
            
            // Calculate ray collision on cols
            for (var x = 0; x <= map.width; x++) {
                var newX = map.tileLength * x - player.position.x;
                var hyp = newX / cos;
                var newY = sin * hyp;
                var vector = new Vector(newX, newY);
                // Vector has the same direction as the ray
                var dot = vector.dot(rayVector);
                if (dot > 0) {
                    vector.addThis(player.position);
                    context.fillRect(origX + vector.x, origY - vector.y, 2, 2);
                }
            }
            
            radians += this.radStep;
        }
    }
    
}
