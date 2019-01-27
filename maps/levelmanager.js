class LevelManager {
    
    constructor() {
        this.currentLevel = 0;
    }
    
    next() {
        this.currentLevel++;
    }
    
    load(player) {
        var map = null;
        if (this.currentLevel === 0) {
            map = new Level1(player);
            map.load();
        }
        if (this.currentLevel === 1) {
            map = new Level2(player);
            map.load();
        }
        return map;
    }
}

