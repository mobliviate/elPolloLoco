/**
 * The controllable player character with movement, jumping,
 * idle/sleep, hurt and death states.
 * Extends {@link MovableObject}.
 * @class
 */
class Character extends MovableObject {

    height = 384;
    width = 160;
    y = 0;
    x = 0;
    speed = 10;
    isDeadAnimationPlayed = false;
    lastActiveTime = Date.now();
    canMove = true;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ];

    IMAGES_IDLE = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_SLEEP = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    world;
    otherDirection = false;

    /**
     * Constructs the player character and starts animation loops.
     * @constructor
     */
    constructor() {
        super().loadImg('img/2_character_pepe/1_idle/idle/I-1.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_SLEEP);

        this.applyGravity();
        this.animate();
    }

    /**
     * Marks the character as active (resets idle/sleep timer).
     * @returns {void}
     */
    markActive() {
        this.lastActiveTime = Date.now();
    }

    /**
     * Checks horizontal movement input state.
     * @returns {boolean} True when LEFT or RIGHT is pressed.
     */
    isMoving() {
        if (!this.world || !this.world.keyboard) { return false; }
        return !!(this.world.keyboard.LEFT || this.world.keyboard.RIGHT);
    }

    /**
     * Indicates whether the character is dead.
     * @returns {boolean} True if energy is zero.
     */
    dead() {
        return this.energy <= 0;
    }

    /**
     * Plays the death animation once and triggers game over.
     * @returns {Promise<void>} Resolves after animation finishes.
     */
    async playDeathAnimation() {
        if (this.isDeadAnimationPlayed) { return; }
        this.isDeadAnimationPlayed = true;
        this.canMove = false;
        this.speed = 0;

        for (let i = 0; i < this.IMAGES_DEAD.length; i++) {
            this.img = this.imageCache[this.IMAGES_DEAD[i]];
            await new Promise(function (resolve) { setTimeout(resolve, 100); });
        }

        if (this.world) { this.world.showGameOver(); }
    }

    /**
     * Uses a tighter collision for the character's head.
     * @param {MovableObject} other - Object to test against.
     * @param {object} [offset] - Optional custom hitbox offsets.
     * @returns {boolean} True if overlapping with adjusted box.
     */
    isColliding(other, offset) {
        let defaultOffset = { top: 152, bottom: 24, left: 44, right: 44 };
        return super.isColliding(other, offset || defaultOffset);
    }

    /**
     * Character-specific gravity: aligns ground with enemies' baseline.
     * Clamps y to the computed ground and resets vertical speed on landing.
     * @returns {void}
     */
    applyGravity() {
        let self = this;
        setInterval(function () {
            let groundTop = self.world ? self.world.getGroundTopYForCharacter(self) : 0;
            if (self.y < groundTop || self.speedY > 0) {
                self.speedY -= self.acceleration;
                self.y -= self.speedY;
                if (self.y > groundTop) {
                    self.y = groundTop;
                    self.speedY = 0;
                }
            }
        }, 1000 / 50);
    }

    /**
     * Uses dynamic ground based on enemies to decide airborne state.
     * @returns {boolean} True if above the computed ground.
     */
    isAboveGround() {
        if (!this.world) { return this.y < 0; }
        return this.y < this.world.getGroundTopYForCharacter(this);
    }

    /**
     * Starts the movement and animation state loops.
     * @returns {void}
     */
    animate() {
        let self = this;

        setInterval(function () {
            if (!self.world || self.world.paused) { return; }
            if (self.dead()) { return; }
            if (!self.canMove) { return; }
            self.handleMovement();
            self.world.camera_x = -self.x + 100;
        }, 10);

        setInterval(function () {
            if (!self.world || self.world.paused) { return; }

            if (self.dead()) {
                if (!self.isDeadAnimationPlayed) { self.playDeathAnimation(); }
            } else if (self.isHurt()) {
                self.playAnimation(self.IMAGES_HURT);
            } else if (self.isAboveGround()) {
                self.playAnimation(self.IMAGES_JUMPING);
            } else if (self.isMoving()) {
                self.playAnimation(self.IMAGES_WALKING);
            } else {
                self.handleIdleSleep();
            }
        }, 200);
    }

    /**
     * Applies keyboard movement and jump input.
     * @returns {void}
     */
    handleMovement() {
        if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.markActive();
        }

        if (this.world.keyboard.LEFT && this.x > -2776) {
            this.moveLeft();
            this.otherDirection = true;
            this.markActive();
        }

        if (this.world.keyboard.UP && !this.isAboveGround()) {
            this.jump();
            audioManager.play('jump');
            this.markActive();
        }
    }

    /**
     * Chooses between idle and sleep animations based on inactivity.
     * @returns {void}
     */
    handleIdleSleep() {
        const sleepMs = 15000;
        const inactive = Date.now() - this.lastActiveTime;
        if (inactive >= sleepMs) { this.playAnimation(this.IMAGES_SLEEP); }
        else { this.playAnimation(this.IMAGES_IDLE); }
    }
}