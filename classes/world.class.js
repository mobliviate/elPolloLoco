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
    gameOver = false;



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
        const character = this.character[0];
        
        if (this.keyboard.D && bottleBar.percentage_bottle >= 10) {
            // Calculate x position based on character's direction
            const xOffset = character.otherDirection ? -50 : 100;
            const xPos = character.otherDirection ? character.x - 50 : character.x + 100;
            
            // Create and add the throwable object with direction
            const bottle = new ThrowableObject(xPos, character.y + 250, character.otherDirection);
            this.throwableObjects.push(bottle);
            
            // Update bottle count
            let newBottleValue = bottleBar.percentage_bottle - 10;
            bottleBar.updateBottleBar(newBottleValue);
    
            // Reset the throw key
            this.keyboard.D = false;
        }
    }

    checkCollisions() {
        const character = this.character[0];
        const endboss = this.level.enemies.find(enemy => enemy instanceof Endboss);
    
        // Check collisions with enemies (chickens and endboss)
        this.level.enemies.forEach((enemy) => {
            if (enemy instanceof Chicken && !enemy.isDead) {
                this.checkChickenCollision(character, enemy);
            }
        });
    
        // Check collisions with throwable objects (salsa bottles)
        this.throwableObjects.forEach((bottle, bottleIndex) => {
            // Check collision with endboss
            if (endboss && endboss.health > 0 && bottle.isColliding(endboss)) {
                const hitSuccessful = endboss.hit();
                if (hitSuccessful) {
                    // Remove the bottle after hitting the endboss
                    this.throwableObjects.splice(bottleIndex, 1);
                }
                return;
            }
            
            // Check collision with chickens
            this.level.enemies.forEach((enemy) => {
                if (enemy instanceof Chicken && !enemy.isDead && bottle.isColliding(enemy)) {
                    enemy.dead();
                    // Remove the bottle after hitting a chicken
                    const bottleIndex = this.throwableObjects.indexOf(bottle);
                    if (bottleIndex > -1) {
                        this.throwableObjects.splice(bottleIndex, 1);
                    }
                }
            });
        });
        
        // Check collision between character and endboss
        if (endboss && endboss.health > 0 && character.isColliding(endboss)) {
            character.hit();
            this.statusBarHealth.updateHealthBar(character.energy);
            if (character.energy <= 0) {
                character.dead();
                // The game over will be triggered after the death animation completes
            }
        }
    }

    checkChickenCollision(character, enemy) {
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
                // The game over will be triggered after the death animation completes
            }
        }
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
        if (this.gameOver) {
            // Don't clear the screen to keep the last frame visible
            return;
        }
        
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
