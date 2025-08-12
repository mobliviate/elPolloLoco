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
            if (self.paused || self.gameOver) { return; }
            self.checkCollisions();
            self.checkThrowObjects();
            self.checkItemCollection();
            self.checkNoWinPossible();
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
     * High-level collision dispatcher; keeps functions small and focused.
     * @returns {void}
     */
    checkCollisions() {
        const character = this.character[0];
        const endboss = this.getEndboss();
        this.checkChickensCollisions(character);
        this.handleBottlesVsEndboss(endboss);
        this.handleBottlesVsChickens();
        this.handleCharacterVsEndboss(character, endboss);
    }

    /**
     * Gets the endboss instance if present.
     * @returns {Endboss|null} The endboss or null.
     */
    getEndboss() {
        let boss = null;
        this.level.enemies.some(function (e) {
            if (e instanceof Endboss) { boss = e; return true; }
            return false;
        });
        return boss;
    }

    /**
     * Checks character collisions with chickens, resolves group stomp or damage.
     * Kills ALL overlappte Hühner bei Stomp.
     * @param {Character} character - Player character.
     * @returns {void}
     */
    checkChickensCollisions(character) {
        let colliders = this.getCollidingChickens(character);
        if (colliders.length === 0) { return; }

        if (this.didStompAny(character, colliders)) {
            this.handleChickenStompGroup(character, colliders);
        } else {
            this.handleChickenDamageToCharacter(character);
        }
    }

    /**
     * Collects all alive chickens currently colliding with the character.
     * @param {Character} character - Player character.
     * @returns {MovableObject[]} Colliding chickens.
     */
    getCollidingChickens(character) {
        let hits = [];
        this.level.enemies.forEach(function (enemy) {
            let isChicken = enemy instanceof Chicken || enemy instanceof ChickenSmall;
            if (isChicken && !enemy.isDead && character.isColliding(enemy)) { hits.push(enemy); }
        });
        return hits;
    }

    /**
     * True if character stomped at least one of the colliding chickens.
     * @param {Character} character - Player character.
     * @param {MovableObject[]} colliders - Colliding chickens.
     * @returns {boolean} Stomp happened.
     */
    didStompAny(character, colliders) {
        for (let i = 0; i < colliders.length; i++) {
            if (this.isStompFromAbove(character, colliders[i])) { return true; }
        }
        return false;
    }

    /**
     * Handles bottle collisions with the endboss.
     * @param {Endboss|null} endboss - The boss enemy.
     * @returns {void}
     */
    handleBottlesVsEndboss(endboss) {
        if (!endboss || endboss.health <= 0) { return; }
        let self = this;
        this.throwableObjects.forEach(function (bottle) {
            if (bottle.isColliding(endboss)) {
                if (endboss.hit()) { audioManager.play('boss_hurt'); self.removeBottle(bottle); }
            }
        });
    }

    /**
     * Handles bottle collisions with chickens.
     * @returns {void}
     */
    handleBottlesVsChickens() {
        let self = this;
        this.throwableObjects.forEach(function (bottle) {
            self.level.enemies.forEach(function (enemy) {
                if ((enemy instanceof Chicken || enemy instanceof ChickenSmall) && !enemy.isDead) {
                    self.hitChickenIfColliding(bottle, enemy);
                }
            });
        });
    }

    /**
     * Hits a chicken if a bottle overlaps it.
     * @param {ThrowableObject} bottle - Thrown bottle.
     * @param {MovableObject} enemy - Chicken or small chicken.
     * @returns {void}
     */
    hitChickenIfColliding(bottle, enemy) {
        if (!bottle.isColliding(enemy)) { return; }
        enemy.dead();
        audioManager.play('enemy_hit');
        this.removeBottle(bottle);
    }

    /**
     * Handles direct character vs endboss collision.
     * @param {Character} character - Player character.
     * @param {Endboss|null} endboss - The boss enemy.
     * @returns {void}
     */
    handleCharacterVsEndboss(character, endboss) {
        if (!endboss || endboss.health <= 0) { return; }
        if (!character.isColliding(endboss)) { return; }
        character.hit();
        audioManager.play('hurt');
        this.statusBarHealth.updateHealthBar(character.energy);
        if (character.energy <= 0) { character.dead(); }
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
     * Robust stomp check: requires downward movement and crossing the head line.
     * Uses character.prevY to detect crossing with tolerance.
     * @param {Character} character - Player character.
     * @param {MovableObject} enemy - Chicken or small chicken.
     * @returns {boolean} True if stomp hit.
     */
    isStompFromAbove(character, enemy) {
        const fallingDown = character.speedY < 0;
        const co = MovableObject.getHitboxOffset(character.constructor.name);
        const eo = MovableObject.getHitboxOffset(enemy.constructor.name);

        const prevFeet = character.prevY + character.height - co.bottom;
        const currFeet = character.y + character.height - co.bottom;
        const enemyHead = enemy.y + eo.top;
        const tolerance = 90;

        const crossed = prevFeet <= (enemyHead + tolerance) && currFeet >= enemyHead;
        return fallingDown && crossed;
    }

    /**
     * Kills all colliding chickens on stomp, bounces and snaps character to heads.
     * @param {Character} character - Player character.
     * @param {MovableObject[]} colliders - Colliding chickens.
     * @returns {void}
     */
    handleChickenStompGroup(character, colliders) {
        let minHead = null;
        for (let i = 0; i < colliders.length; i++) {
            let enemy = colliders[i];
            if (this.isStompFromAbove(character, enemy)) {
                enemy.dead();
                let headY = this.getEnemyHeadY(enemy);
                if (minHead === null || headY < minHead) { minHead = headY; }
            }
        }
        if (minHead !== null) {
            audioManager.play('enemy_hit');
            character.speedY = 12;
            character.y = minHead - character.height;
            character.prevY = character.y;
        }
    }

    /**
     * Returns the "head top" Y position of an enemy.
     * @param {MovableObject} enemy - Chicken or small chicken.
     * @returns {number} Head top Y.
     */
    getEnemyHeadY(enemy) {
        const eo = MovableObject.getHitboxOffset(enemy.constructor.name);
        return enemy.y + eo.top;
    }

    /**
     * Applies damage from chicken to the character.
     * @param {Character} character - Player character.
     * @returns {void}
     */
    handleChickenDamageToCharacter(character) {
        character.hit();
        audioManager.play('hurt');
        this.statusBarHealth.updateHealthBar(character.energy);
        if (character.energy <= 0) { character.dead(); }
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
     * Auto-lose when no bottles remain anywhere and boss still alive.
     * Runs in the main loop.
     * @returns {void}
     */
    checkNoWinPossible() {
        let boss = this.getEndboss();
        if (!boss || boss.health <= 0) { return; }
        let noStock = this.statusBarBottle.percentage_bottle === 0;
        let noneOnMap = this.level.bottles.length === 0;
        let activeThrow = this.throwableObjects.some(function (b) { return !b.isSplashing; });
        if (noStock && noneOnMap && !activeThrow) { this.showGameOver(); }
    }

    /**
     * Computes the character's ground top (y for character's head when standing).
     * Uses enemies' baselines; falls back to 460 if none exist.
     * @param {Character} character - Player character.
     * @returns {number} Top y for the character on ground.
     */
    getGroundTopYForCharacter(character) {
        let baselines = [];
        this.level.enemies.forEach(function (e) {
            if (e instanceof Chicken || e instanceof ChickenSmall) { baselines.push(e.y + e.height); }
        });
        let base = baselines.length ? Math.max.apply(null, baselines) : 460;
        return base - character.height;
    }

    /**
     * The drawing loop using requestAnimationFrame to paint the scene.
     * Ensures z-order: enemies < character < bottles.
     * @returns {void}
     */
    draw() {
        if (this.gameOver) { return; }

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

        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function () { self.draw(); });
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