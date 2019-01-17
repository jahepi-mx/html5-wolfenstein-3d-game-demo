class Enemy {
    
    constructor(x, y) {
        this.length = 10;
        this.moves = [[-1, 0], [0, -1], [1, 0], [0, 1]];
        this.position = new Vector(map.tileLength * x + map.tileLength / 2, map.tileLength * y + map.tileLength / 2);
        this.velocity = new Vector(0, 0);
        this.velocityTmp = new Vector(20, 20);
        this.searchTime = 0;
        this.searchTimeLimit = 3;
        this.path = [];
        this.pathTo = null;
    }
    
    update(dt) {
        this.searchTime += dt;
        if (this.searchTime > this.searchTimeLimit) {
            this.pathfinding();
            this.searchTime = 0;
        }
        
        if (this.path.length > 0 && this.pathTo === null) {
            this.pathTo = this.path.pop();
        }
        
        if (this.pathTo !== null) {
            var translate = this.pathTo.sub(this.position);
            if (translate.dot(translate) <= 10) {
                this.velocity.x = 0;
                this.velocity.y = 0;
                if (this.path.length > 0) {
                    this.pathTo = this.path.pop();
                }
            } else {
                var margin = 2;
                if (translate.y < -margin) {
                    this.velocity.y = -this.velocityTmp.y;
                } else if (translate.y > margin) {
                    this.velocity.y = this.velocityTmp.y;
                } else {
                    this.velocity.y = 0;
                }
                
                if (translate.x < -margin) {
                    this.velocity.x = -this.velocityTmp.x;
                } else if (translate.x > margin) {
                    this.velocity.x = this.velocityTmp.x;
                } else {
                    this.velocity.x = 0;
                }
            }
        }
        this.position.addThis(this.velocity.mul(dt));
    }
    
    pathfinding() {
        var fromX = parseInt(this.position.x / map.tileLength);
        var fromY = parseInt(this.position.y / map.tileLength);
        var fromTile = map.tiles[fromY * map.width + fromX];
        var toX = parseInt(player.position.x / map.tileLength);
        var toY = parseInt(player.position.y / map.tileLength);
        var toTile = map.tiles[toY * map.width + toX];
        var queue = new PriorityQueue(function (a, b) {
            return a.priority > b.priority;
        });
        var parents = [];
        var visited = [];
        var toTileFound = false;
        visited[fromY * map.width + fromX] = 1;
        queue.add(fromTile, 0);
        out: while (!queue.isEmpty()) {
            var tile = queue.remove().object;     
            for (let move of this.moves) {
                var newTileX = tile.mapPosition.x + move[0];
                var newTileY = tile.mapPosition.y + move[1];
                if (newTileX >= 0 && newTileX < map.width && newTileY >= 0 && newTileY < map.height) {
                    var nextTile = map.tiles[newTileY * map.width + newTileX];
                    if (visited[newTileY * map.width + newTileX] !== 1 && nextTile.walkable) {
                        visited[newTileY * map.width + newTileX] = 1;
                        parents[newTileY * map.width + newTileX] = tile.mapPosition.y * map.width + tile.mapPosition.x;
                        if (nextTile.mapPosition.equals(toTile.mapPosition)) {
                            toTileFound = true;
                            break out;
                        } else {
                            var diff = player.position.sub(nextTile.position);
                            var heuristic = Math.abs(diff.x) + Math.abs(diff.y);
                            queue.add(nextTile, heuristic);
                        }
                    }
                }
            }
        }
        if (toTileFound) {
            this.path = [];
            var index = toTile.mapPosition.y * map.width + toTile.mapPosition.x;
            while (parents[index] !== undefined) {
                this.path.push(map.tiles[index].position);
                index = parents[index];
            }
            this.path.push(map.tiles[index].position);
        }
    }
    
    render(context) {
        context.fillStyle = "#0000ff";
        context.fillRect(origX + (this.position.x - this.length / 2), origY - (this.position.y + this.length / 2), this.length, this.length);
    } 
}

