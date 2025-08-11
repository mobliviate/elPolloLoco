/**
 * The central game coordinator: renders, updates, handles collisions,
 * and orchestrates status bars and input.
 * @class
 */
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
     * Creates a World instance and starts main loops.
     * @param {HTMLCanvasElement} canvas - Canvas element to render to.
     * @param {Keyboard} keyboard - Keyboard state reference.
     * @param {Level} level - Level definition with objects.
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
     * Connects the main character with this world instance.
     * @returns {void}
     */
    setWorld() {
        this.character[0].world = this;
    }

    /**
     * Starts cloud/background animations after game begins.
     * @returns {void}
     */
    startEnvironmentAnimations() {
        this.level.clouds.forEach(function (cloud) {
            if (typeof cloud.animate === 'function') {
                cloud.animate();
            }
        });
    }

    /**
     * Periodic game logic loop handling collisions, throws, and pickups.
     * @returns {void}
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
     * Toggles the pause state of the world.
     * @returns {void}
     */
    togglePause() {
        this.paused = !this.paused;
    }

    /**
     * Handles bottle throwing when input is active and stock available.
     * @returns {void}
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
     * Performs collision detection for character, bottles, and enemies.
     * @returns {void}
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
     * Removes a bottle from the active projectiles and plays splash.
     * @param {ThrowableObject} bottle - Bottle to remove.
     * @returns {void}
     */
    removeBottle(bottle) {
        const idx = this.throwableObjects.indexOf(bottle);
        if (idx > -1) {
            this.throwableObjects.splice(idx, 1);
        }
        audioManager.play('bottle_splash');
    }

    /**
     * Resolves character vs. chicken collision:
     * landing from above kills chicken, else character is hurt.
     * @param {Character} character - Player character.
     * @param {MovableObject} enemy - Chicken or small chicken.
     * @returns {void}
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

        const tolerance = 60;
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
     * Checks and applies pickup logic for coins and bottles.
     * @returns {void}
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
     * The drawing loop using requestAnimationFrame to paint the scene.
     * @returns {void}
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
     * Adds multiple drawables to the map (canvas).
     * @param {DrawableObject[]} objects - List of objects to draw.
     * @returns {void}
     */
    addObjectsToMap(objects) {
        objects.forEach(function (object) {
            this.addToMap(object);
        }.bind(this));
    }

    /**
     * Adds a single object to the map while handling mirroring.
     * @param {MovableObject|DrawableObject} movableObject - Object to draw.
     * @returns {void}
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
     * Flips the canvas horizontally for mirrored drawing.
     * @param {MovableObject} movableObject - Object being flipped.
     * @returns {void}
     */
    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = -movableObject.x;
    }

    /**
     * Restores canvas transform after a flip.
     * @param {MovableObject} movableObject - Object being unflipped.
     * @returns {void}
     */
    flipImageBack(movableObject) {
        movableObject.x = -movableObject.x;
        this.ctx.restore();
    }

    /**
     * Triggers the game over UI and stops the loop.
     * @returns {void}
     */
    showGameOver() {
        this.gameOver = true;
        showEndscreen('lose');
    }

    /**
     * Triggers the win UI and stops the loop.
     * @returns {void}
     */
    showWin() {
        this.gameOver = true;
        showEndscreen('win');
    }
}