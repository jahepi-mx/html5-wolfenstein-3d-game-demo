class Level2 extends Map {
    
    constructor(player) {
        super(player, null);
        this.width = 32;
        this.height = 5;
        
        this.player.position.x = this.tileLength * 1 + this.tileLength / 2;
        this.player.position.y = this.tileLength * 1 + this.tileLength / 2; 
        
        this.map = [
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0,7,0,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
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
        this.items.push(new Life(3, 2, this.tileLength));
        
        var enemy = new Enemy(28, 3, 100, this);
        this.enemies.push(enemy);
        var enemy = new Enemy(24, 2, 120, this);
        this.enemies.push(enemy);
        var enemy = new Enemy(26, 2, 140, this);
        this.enemies.push(enemy);
    }
    
    update(dt) {
       
    }
}


