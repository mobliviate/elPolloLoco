class World {

    character = [new Character()];
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBar('health', 0);
    statusBarCoin = new StatusBar('coin', 40);
    statusBarBottle = new StatusBar('bottle', 80);
    throwableObjects = [];



    constructor(canvas, keyboard) {
        this.keyboard = keyboard;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.statusBarCoin.updateCoinBar(0);
        this.statusBarBottle.updateBottleBar(0);
        this.draw();
        this.setWorld();
        this.run();
    }

    setWorld() {
        this.character[0].world = this;
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.checkItemCollection();
        }, 100);
    }

    checkThrowObjects() {
        const bottleBar = this.statusBarBottle;
        
        if (this.keyboard.D && bottleBar.percentage_bottle >= 10) {
            this.throwableObjects.push(new ThrowableObject(this.character[0].x + 100, this.character[0].y + 250));
            
            let newBottleValue = bottleBar.percentage_bottle - 10;
            bottleBar.updateBottleBar(newBottleValue);
    
            this.keyboard.D = false;
        }
    }

    checkCollisions() {
        const character = this.character[0];
    
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken && !enemy.isDead) {
                const landedOnChicken =
                    character.isColliding(enemy) &&
                    character.speedY < 0 &&
                    character.y + character.height < enemy.y + enemy.height;
    
                if (landedOnChicken) {
                    enemy.dead();
                    character.speedY = 10;
                    return;
                }
    
                if (character.isColliding(enemy)) {
                    character.hit();
                    this.statusBarHealth.updateHealthBar(character.energy);
                    if (character.energy <= 0) {
                        character.dead();
                    }
                }
            }
        });
    
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (enemy instanceof Chicken && !enemy.isDead && bottle.isColliding(enemy)) {
                    enemy.dead();
                }
            });
        });
    }

    checkItemCollection() {
        const character = this.character[0];
    
        this.level.coins.forEach((coin, index) => {
            if (character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.statusBarCoin.updateCoinBar(
                    Math.min(100, this.statusBarCoin.percentage_coin + 10)
                );
            }
        });
    
        this.level.bottles.forEach((bottle, index) => {
            if (character.isColliding(bottle)) {
                this.level.bottles.splice(index, 1);
                this.statusBarBottle.updateBottleBar(
                    Math.min(100, this.statusBarBottle.percentage_bottle + 10)
                );
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.level.bottles);

        this.ctx.translate(-this.camera_x, 0);

        this.addToMap(this.statusBarHealth);
        this.addToMap(this.statusBarCoin);
        this.addToMap(this.statusBarBottle);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);


        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(movableObject) {
        if (movableObject.otherDirection) {
            this.flipImage(movableObject);
        }

        movableObject.draw(this.ctx);
        movableObject.drawFrame(this.ctx);

        if (movableObject.otherDirection) {
            this.flipImageBack(movableObject);
        }
    }

    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = -movableObject.x;
    }

    flipImageBack(movableObject) {
        movableObject.x = -movableObject.x;
        this.ctx.restore();

    }
}
