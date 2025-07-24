// classes/world.class.js
class World {

    character = [new Character()];
    level;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBar('health', 0);
    statusBarCoin = new StatusBar('coin', 40);
    statusBarBottle = new StatusBar('bottle', 80);
    throwableObjects = [];
    gameOver = false;
    paused = false;

    /**
     * @param {HTMLCanvasElement} canvas 
     * @param {Keyboard} keyboard 
     * @param {Level} level
     */
    constructor(canvas, keyboard, level) {
        this.keyboard = keyboard;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.level = level;

        this.statusBarCoin.updateCoinBar(0);
        this.statusBarBottle.updateBottleBar(0);

        this.setWorld();
        this.startEnvironmentAnimations();
        this.draw();
        this.run();
    }

    /**
     * Connect character with world.
     */
    setWorld() {
        this.character[0].world = this;
    }

    /**
     * Starts background/cloud animations once game starts.
     */
    startEnvironmentAnimations() {
        this.level.clouds.forEach(function (cloud) {
            if (typeof cloud.animate === 'function') {
                cloud.animate();
            }
        });
    }

    /**
     * Main game loop logic executed in interval.
     */
    run() {
        let self = this;
        setInterval(function () {
            if (self.paused || self.gameOver) {
                return;
            }
            self.checkCollisions();
            self.checkThrowObjects();
            self.checkItemCollection();
        }, 100);
    }

    /**
     * Toggle pause.
     */
    togglePause() {
        this.paused = !this.paused;
    }

    /**
     * Handles bottle throwing.
     */
    checkThrowObjects() {
        const bottleBar = this.statusBarBottle;
        const character = this.character[0];

        if (this.keyboard.D && bottleBar.percentage_bottle >= 10) {
            const throwLeft = character.otherDirection;
            const xPos = throwLeft ? character.x - 50 : character.x + 100;
            const bottle = new ThrowableObject(xPos, character.y + 250, throwLeft);
            this.throwableObjects.push(bottle);
            audioManager.play('bottle_throw');
            bottleBar.updateBottleBar(bottleBar.percentage_bottle - 10);
            this.keyboard.D = false;
        }
    }

    /**
     * Collision checks.
     */
    checkCollisions() {
        const character = this.character[0];
        const endboss = this.level.enemies.find(function (enemy) { return enemy instanceof Endboss; });

        this.level.enemies.forEach(function (enemy) {
            if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) && !enemy.isDead) {
                this.checkChickenCollision(character, enemy);
            }
        }.bind(this));

        this.throwableObjects.forEach(function (bottle) {
            if (endboss && endboss.health > 0 && bottle.isColliding(endboss)) {
                const hitSuccessful = endboss.hit();
                if (hitSuccessful) {
                    audioManager.play('boss_hurt');
                    this.removeBottle(bottle);
                }
                return;
            }
            this.level.enemies.forEach(function (enemy) {
                if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) && !enemy.isDead && bottle.isColliding(enemy)) {
                    enemy.dead();
                    audioManager.play('enemy_hit');
                    this.removeBottle(bottle);
                }
            }.bind(this));
        }.bind(this));

        if (endboss && endboss.health > 0 && character.isColliding(endboss)) {
            character.hit();
            audioManager.play('hurt');
            this.statusBarHealth.updateHealthBar(character.energy);
            if (character.energy <= 0) {
                character.dead();
            }
        }
    }

    /**
     * Removes bottle from array.
     * @param {ThrowableObject} bottle 
     */
    removeBottle(bottle) {
        const idx = this.throwableObjects.indexOf(bottle);
        if (idx > -1) {
            this.throwableObjects.splice(idx, 1);
        }
        audioManager.play('bottle_splash');
    }

    /**
     * Only kill chickens when the character lands clearly from above.
     * Adjusted to also work for big chickens.
     * @param {Character} character 
     * @param {MovableObject} enemy 
     */
    checkChickenCollision(character, enemy) {
        if (!character.isColliding(enemy)) {
            return;
        }

        const fallingDown = character.speedY < 0;
        const charOffset = MovableObject.getHitboxOffset(character.constructor.name);
        const enemyOffset = MovableObject.getHitboxOffset(enemy.constructor.name);

        const charFeet = character.y + character.height - charOffset.bottom;
        const enemyHead = enemy.y + enemyOffset.top;

        const tolerance = 60; // small buffer to ensure top-hit is recognized
        const landedOnChicken = fallingDown && charFeet <= (enemyHead + tolerance);

        if (landedOnChicken) {
            enemy.dead();
            character.speedY = 12;
            audioManager.play('enemy_hit');
        } else {
            character.hit();
            audioManager.play('hurt');
            this.statusBarHealth.updateHealthBar(character.energy);
            if (character.energy <= 0) {
                character.dead();
            }
        }
    }

    /**
     * Checks collection of coins and bottles.
     */
    checkItemCollection() {
        const character = this.character[0];

        this.level.coins.forEach(function (coin, index) {
            if (character.isColliding(coin)) {
                this.level.coins.splice(index, 1);
                this.statusBarCoin.updateCoinBar(Math.min(100, this.statusBarCoin.percentage_coin + 10));
                audioManager.play('coin');
            }
        }.bind(this));

        this.level.bottles.forEach(function (bottle, index) {
            if (character.isColliding(bottle)) {
                this.level.bottles.splice(index, 1);
                this.statusBarBottle.updateBottleBar(Math.min(100, this.statusBarBottle.percentage_bottle + 10));
            }
        }.bind(this));
    }

    /**
     * Drawing loop using requestAnimationFrame.
     */
    draw() {
        if (this.gameOver) {
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

    /**
     * Helper to add multiple objects.
     * @param {DrawableObject[]} objects 
     */
    addObjectsToMap(objects) {
        objects.forEach(function (object) {
            this.addToMap(object);
        }.bind(this));
    }

    /**
     * Adds single object considering flip.
     * @param {MovableObject} movableObject 
     */
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

    /**
     * Flips the image horizontally.
     * @param {MovableObject} movableObject 
     */
    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = -movableObject.x;
    }

    /**
     * Restores flipped image.
     * @param {MovableObject} movableObject 
     */
    flipImageBack(movableObject) {
        movableObject.x = -movableObject.x;
        this.ctx.restore();
    }

    /**
     * Shows game over.
     */
    showGameOver() {
        this.gameOver = true;
        showEndscreen('lose');
    }

    /**
     * Shows win screen.
     */
    showWin() {
        this.gameOver = true;
        showEndscreen('win');
    }
}