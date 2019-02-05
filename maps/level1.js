class Level1 extends Map {
    
    constructor(player) {
        super(player, new Vector(1, 29));
        this.width = 32;
        this.height = 32;
        
        this.player.position.x = this.tileLength * 1 + this.tileLength / 2;
        this.player.position.y = this.tileLength * 1 + this.tileLength / 2;
        this.player.setViewDirection(Math.PI / 2);
        
        this.map = [12, 12, 12, 12, 12, 15, 12, 15, 12, 15, 12, 15, 12, 15, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 8, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 12, 12, 12, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 20, 1, 1, 9, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 12, 6, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 13, 13, 8, 1, 1, 17, 1, 17, 1, 17, 1, 17, 1, 12, 12, 12, 8, 1, 1, 14, 1, 1, 1, 2, 1, 1, 1, 14, 1, 1, 12, 12, 12, 12, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 5, 1, 9, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 12, 12, 12, 1, 1, 17, 1, 17, 1, 17, 1, 17, 1, 12, 12, 12, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 12, 12, 12, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 12, 6, 1, 9, 1, 1, 2, 1, 1, 1, 14, 1, 1, 1, 2, 1, 1, 12, 12, 12, 12, 12, 1, 1, 17, 1, 17, 1, 17, 1, 17, 1, 12, 12, 12, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 12, 12, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 9, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 5, 1, 9, 1, 5, 17, 1, 17, 1, 17, 1, 17, 1, 12, 12, 12, 8, 1, 1, 14, 1, 1, 1, 2, 1, 1, 1, 14, 1, 1, 12, 12, 12, 12, 8, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 12, 4, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 12, 12, 12, 12, 16, 12, 16, 12, 16, 12, 16, 12, 16, 12, 12, 12, 8, 12, 12, 12, 12, 12, 12, 10, 11, 10, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 1, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 19, 1, 3, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14, 1, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 19, 4, 4, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 14, 1, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 19, 1, 3, 12, 12, 12, 12, 12, 12, 12, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 1, 12, 12, 12, 12, 12, 12, 12, 1, 1, 2, 1, 1, 2, 1, 1, 8, 12, 19, 1, 12, 12, 1, 12, 8, 13, 12, 13, 12, 12, 12, 10, 11, 10, 12, 12, 12, 12, 12, 12, 1, 1, 1, 4, 4, 1, 1, 1, 9, 1, 1, 3, 4, 1, 3, 1, 9, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 1, 1, 2, 1, 1, 2, 1, 1, 8, 12, 12, 12, 12, 12, 12, 12, 8, 13, 1, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 1, 12, 1, 5, 1, 5, 1, 5, 1, 5, 1, 1, 12, 10, 11, 10, 12, 12, 12, 10, 11, 10, 12, 12, 1, 1, 1, 1, 5, 1, 5, 1, 1, 13, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 1, 1, 5, 12, 1, 1, 1, 1, 12, 12, 1, 12, 12, 12, 2, 12, 2, 12, 2, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 1, 4, 1, 12, 6, 1, 1, 1, 12, 10, 11, 10, 12, 12, 12, 12, 12, 12, 12, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 1, 1, 1, 12, 1, 1, 6, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 10, 11, 10, 12, 1, 2, 1, 4, 12, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 8, 19, 19, 19, 10, 11, 10, 19, 19, 19, 19, 12, 12, 1, 1, 1, 12, 1, 1, 1, 4, 12, 1, 1, 1, 4, 1, 2, 4, 1, 6, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 1, 1, 1, 12, 1, 6, 1, 4, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 1, 1, 4, 4, 4, 4, 4, 1, 1, 1, 12, 12, 1, 1, 1, 12, 1, 1, 1, 1, 12, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 12, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 12, 12, 12, 12, 12, 12, 17, 17, 17, 17, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 18, 12, 18, 12, 18, 12, 18, 12, 18, 12, 12];
        
        // Soldiers
        this.enemyParams[7 * this.width + 3] = {velocity: 100, dirRadians: Math.PI / 2, shootTimeLimit: 1, shootDistance: 5000, unawarenessDistance: 0, awarenessDistance: 0, life: 5};
        
        this.enemyParams[8 * this.width + 17] = {velocity: 70, dirRadians: Math.PI, shootTimeLimit: 1, shootDistance: 5000, unawarenessDistance: 0, awarenessDistance: 5000, life: 5};
        this.enemyParams[8 * this.width + 15] = {velocity: 50, dirRadians: Math.PI, shootTimeLimit: 1, shootDistance: 5000, unawarenessDistance: 0, awarenessDistance: 5000, life: 5};
        
        this.enemyParams[9 * this.width + 22] = {velocity: 105, dirRadians: Math.PI / 2 * 4, shootTimeLimit: 0.6, shootDistance: 10000, unawarenessDistance: 0, awarenessDistance: 300000, life: 7};
        this.enemyParams[9 * this.width + 24] = {velocity: 70, dirRadians: Math.PI / 2 * 3, shootTimeLimit: 0.6, shootDistance: 10000, unawarenessDistance: 0, awarenessDistance: 300000, life: 7};
        this.enemyParams[9 * this.width + 26] = {velocity: 90, dirRadians: Math.PI / 2 * 3, shootTimeLimit: 0.6, shootDistance: 10000, unawarenessDistance: 0, awarenessDistance: 300000, life: 7};
        this.enemyParams[9 * this.width + 28] = {velocity: 65, dirRadians: Math.PI / 2 * 3, shootTimeLimit: 0.6, shootDistance: 10000, unawarenessDistance: 0, awarenessDistance: 300000, life: 7};
        
        this.enemyParams[27 * this.width + 15] = {velocity: 120, dirRadians: 0, shootTimeLimit: 0.6, shootDistance: 10000, unawarenessDistance: 0, awarenessDistance: 0, life: 7};
        
        this.enemyParams[25 * this.width + 8] = {velocity: 110, dirRadians: 0, shootTimeLimit: 0.4, shootDistance: 10000, unawarenessDistance: 0, awarenessDistance: 0, life: 7};
        this.enemyParams[22 * this.width + 5] = {velocity: 90, dirRadians: 0, shootTimeLimit: 0.4, shootDistance: 10000, unawarenessDistance: 0, awarenessDistance: 0, life: 7};
        this.enemyParams[29 * this.width + 5] = {velocity: 100, dirRadians: 0, shootTimeLimit: 0.4, shootDistance: 10000, unawarenessDistance: 0, awarenessDistance: 0, life: 7};
        this.enemyParams[22 * this.width + 1] = {velocity: 80, dirRadians: 0, shootTimeLimit: 0.4, shootDistance: 10000, unawarenessDistance: 0, awarenessDistance: 0, life: 7};
        
        
        // Dogs
        this.enemyParams[6 * this.width + 5] = {velocity: 100, dirRadians: Math.PI / 2, life: 3};
        this.enemyParams[5 * this.width + 7] = {velocity: 80, dirRadians: Math.PI / 2, life: 3};
        this.enemyParams[2 * this.width + 6] = {velocity: 50, dirRadians: Math.PI / 2, life: 3};
        
        this.enemyParams[1 * this.width + 11] = {velocity: 100, dirRadians: Math.PI / 2, life: 3};
        this.enemyParams[4 * this.width + 15] = {velocity: 120, dirRadians: Math.PI / 2, life: 3};
        this.enemyParams[3 * this.width + 18] = {velocity: 130, dirRadians: Math.PI / 2, life: 3};
        
        this.enemyParams[27 * this.width + 21] = {velocity: 100, dirRadians: Math.PI / 2, life: 3};
        this.enemyParams[23 * this.width + 21] = {velocity: 90, dirRadians: Math.PI / 2, life: 3};
        
        this.enemyParams[29 * this.width + 15] = {velocity: 90, dirRadians: Math.PI / 2 * 4, life: 3};
        this.enemyParams[25 * this.width + 15] = {velocity: 120, dirRadians: Math.PI / 2 * 4, life: 3};
        
        this.enemyParams[21 * this.width + 10] = {velocity: 130, dirRadians: Math.PI / 2, life: 3};
        this.enemyParams[30 * this.width + 10] = {velocity: 120, dirRadians: Math.PI / 2, life: 3};
        
        //this.enemyParams[15 * this.width + 3] = {velocity: 200, shootTimeLimit: 0.2};
        //this.enemyParams[18 * this.width + 7] = {velocity: 100, dirRadians: Math.PI / 2};
        
        // Blocks
        this.enemyParams[11 * this.width + 12] = {velocity: 10, vertical: true, numberOfBlocksToMove: 1};
        this.enemyParams[11 * this.width + 15] = {velocity: 30, vertical: true, numberOfBlocksToMove: 1};
        
        this.enemyParams[14 * this.width + 25] = {velocity: 5, vertical: false, numberOfBlocksToMove: 1};
        this.enemyParams[18 * this.width + 25] = {velocity: 20, vertical: false, numberOfBlocksToMove: 1};
        
        music = Assets.getInstance().playAudio(Assets.getInstance().level1, true, 0.03);
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
        this.isFinished = false;
        this.player.setViewDirection(Math.PI / 2);
        this.player.life = 20;
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


