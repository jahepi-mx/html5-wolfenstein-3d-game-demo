class Level1 extends Map {
    
    constructor(player) {
        super(player, new Vector(10, 2));
        this.width = 32;
        this.height = 32;
        
        this.player.position.x = this.tileLength * 1 + this.tileLength / 2;
        this.player.position.y = this.tileLength * 1 + this.tileLength / 2; 
        
        this.map = [
            1,1,1,1,1,4,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,2,0,0,7,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,1,
            1,0,6,0,0,1,0,0,0,0,1,5,3,5,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,1,0,4,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,1,0,0,1,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,0,1,4,1,1,0,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,2,0,0,7,0,0,7,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,6,0,0,1,0,0,0,0,1,5,3,5,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,1,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,1,0,0,1,0,0,0,0,4,0,0,0,0,1,0,0,0,0,7,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,0,1,4,1,1,0,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,2,0,0,7,0,0,7,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,
            1,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,6,0,0,1,0,0,0,0,1,5,3,5,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,1,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,7,0,0,1,0,0,0,0,0,0,1,
            1,0,1,0,0,1,0,0,0,0,4,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,1,0,4,1,1,0,1,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,2,0,0,7,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,4,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,6,0,0,1,0,0,0,0,1,5,3,5,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,1,0,4,0,4,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,0,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,1,0,0,1,0,0,0,0,4,0,4,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        ];
        
        this.loadItemsAndEnemies();
    }
    
    reset() {
        this.tiles = [];
        this.walls = [];
        this.movingWalls = [];
        this.doors = [];
        this.sprites = [];
        this.enemies = [];
        this.items = [];
        this.player.position.x = this.tileLength * 1 + this.tileLength / 2;
        this.player.position.y = this.tileLength * 1 + this.tileLength / 2;
        this.load();
        this.loadItemsAndEnemies();
        this.isFinished = false;
    }
    
    loadItemsAndEnemies() {
        this.items.push(new Life(6, 3, this.tileLength));
        this.items.push(new Life(6, 2, this.tileLength));
        this.items.push(new Life(19, 1, this.tileLength));
        this.items.push(new Life(19, 2, this.tileLength));
        this.items.push(new Life(19, 3, this.tileLength));
        this.items.push(new Life(19, 4, this.tileLength));
        this.items.push(new Life(19, 5, this.tileLength));
        
        //var enemy = new Soldier(8, 5, 20, this);
        //this.enemies.push(enemy);
        //var enemy = new Soldier(8, 4, 40, this);
        //this.enemies.push(enemy);
        var enemy = new Soldier(4, 5, 60, this);
        this.enemies.push(enemy);
        var enemy = new Dog(8, 4, 60, this);
        this.enemies.push(enemy);
        var enemy = new Boss(1, 4, 60, this);
        this.enemies.push(enemy);
    }
    
    update(dt) {
        if (this.exitTile !== null) {
            var x = Math.abs(this.exitTile.position.x - this.player.position.x);
            var y = Math.abs(this.exitTile.position.y - this.player.position.y);
            var size = this.player.length / 2 + this.exitTile.length / 2;
            if (x <= size && y <= size) {
                this.isFinished = true;
            }
        }
    }
}


