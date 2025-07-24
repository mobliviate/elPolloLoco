// classes/character.class.js
class Character extends MovableObject {

    height = 480;
    width = 200;
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

    constructor() {
        super().loadImg('img/2_character_pepe/2_walk/W-21.png');
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
     * Marks character as active (for idle/sleep timer).
     */
    markActive() {
        this.lastActiveTime = Date.now();
    }

    /**
     * Is character dead?
     */
    dead() {
        return this.energy <= 0;
    }

    /**
     * Plays death animation and ends game.
     */
    async playDeathAnimation() {
        if (this.isDeadAnimationPlayed) return;
        this.isDeadAnimationPlayed = true;
        this.canMove = false;
        this.speed = 0;

        for (let i = 0; i < this.IMAGES_DEAD.length; i++) {
            this.img = this.imageCache[this.IMAGES_DEAD[i]];
            await new Promise(function (resolve) { setTimeout(resolve, 100); });
        }

        if (this.world) {
            this.world.showGameOver();
        }
    }

    /**
     * Collision detection override with tighter top-hit requirement.
     * @param {MovableObject} other 
     * @param {object} offset 
     */
    isColliding(other, offset) {
        let defaultOffset = { top: 190, bottom: 30, left: 55, right: 55 };
        return super.isColliding(other, offset || defaultOffset);
    }

    /**
     * Main character loop.
     */
    animate() {
        let self = this;

        // Movement loop
        setInterval(function () {
            if (!self.world || self.world.paused) return;
            if (self.dead()) return;
            if (!self.canMove) return;

            self.handleMovement();
            self.world.camera_x = -self.x + 100;
        }, 10);

        // Animation state loop
        setInterval(function () {
            if (!self.world || self.world.paused) return;

            if (self.dead()) {
                if (!self.isDeadAnimationPlayed) {
                    self.playDeathAnimation();
                }
            } else if (self.isHurt()) {
                self.playAnimation(self.IMAGES_HURT);
            } else if (self.isAboveGround()) {
                self.playAnimation(self.IMAGES_JUMPING);
            } else {
                self.handleIdleSleep();
            }
        }, 200);
    }

    /**
     * Handles movement based on keyboard.
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
     * Handles idle and sleep animations.
     */
    handleIdleSleep() {
        const idleMs = 3000;
        const sleepMs = 15000;
        const inactive = Date.now() - this.lastActiveTime;

        if (inactive >= sleepMs) {
            this.playAnimation(this.IMAGES_SLEEP);
            if (inactive - sleepMs < 300) {
                audioManager.play('snore');
            }
        } else if (inactive >= idleMs) {
            this.playAnimation(this.IMAGES_IDLE);
        } else {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }
}