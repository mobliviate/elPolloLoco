/**
 * The boss enemy with multiple states and limited health.
 * Extends {@link MovableObject}.
 * @class
 */
class Endboss extends MovableObject {
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMAGES_DEAD = [
        'img/4_enemie_boss_chicken/5_dead/G24.png',
        'img/4_enemie_boss_chicken/5_dead/G25.png',
        'img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    /**
     * Enum-like state mapping for the boss.
     * @readonly
     */
    static STATES = {
        ALERT: 'alert',
        WALK: 'walk',
        ATTACK: 'attack',
        HURT: 'hurt',
        DEAD: 'dead'
    };

    health = 5;
    isHurt = false;
    state = Endboss.STATES.ALERT;
    lastHitTime = 0;
    hurtCooldown = 1000;
    movementRange = 300;
    startX;
    movementSpeed = 6;

    /**
     * Creates the endboss at its initial position and starts animation.
     * @constructor
     */
    constructor() {
        super().loadImg('img/4_enemie_boss_chicken/2_alert/G5.png');
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.x = 2800;
        this.startX = this.x;
        this.speed = 0.5;
        this.animate();
    }

    /**
     * Applies damage if cooldown elapsed, sets state transitions.
     * @returns {boolean} True when the hit was accepted.
     */
    hit() {
        const now = Date.now();
        if (now - this.lastHitTime > this.hurtCooldown) {
            this.health--;
            this.lastHitTime = now;
            this.isHurt = true;

            if (this.state !== Endboss.STATES.ATTACK && this.state !== Endboss.STATES.HURT) {
                this.state = Endboss.STATES.ATTACK;
                this.startX = this.x;
            }

            if (this.health <= 0) {
                this.defeated();
            } else {
                this.state = Endboss.STATES.HURT;
                let self = this;
                setTimeout(function () {
                    self.isHurt = false;
                    self.state = Endboss.STATES.ATTACK;
                }, 500);
            }
            return true;
        }
        return false;
    }

    /**
     * Plays the death sequence and resolves when finished.
     * @returns {Promise<void>} Resolves once the animation completes.
     */
    async defeated() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }

        this.state = Endboss.STATES.DEAD;
        let currentFrame = 0;
        let self = this;

        return new Promise(function (resolve) {
            self.animationInterval = setInterval(function () {
                if (currentFrame < self.IMAGES_DEAD.length) {
                    const imagePath = self.IMAGES_DEAD[currentFrame];
                    if (self.imageCache[imagePath]) {
                        self.img = self.imageCache[imagePath];
                        currentFrame++;
                    }
                } else {
                    clearInterval(self.animationInterval);
                    if (world) {
                        world.showWin();
                    }
                    resolve();
                }
            }, 200);
        });
    }

    /**
     * Drives the boss animation state machine.
     * @returns {void}
     */
    animate() {
        let self = this;
        const animationInterval = setInterval(function () {
            if (world && world.gameOver) {
                clearInterval(animationInterval);
                return;
            }

            switch (self.state) {
                case Endboss.STATES.ALERT:
                    self.playAnimation(self.IMAGES_ALERT);
                    break;
                case Endboss.STATES.WALK:
                    self.playAnimation(self.IMAGES_WALKING);
                    self.moveLeft();
                    break;
                case Endboss.STATES.ATTACK:
                    self.playAnimation(self.IMAGES_ATTACK);
                    self.moveHorizontally();
                    break;
                case Endboss.STATES.HURT:
                    self.playAnimation(self.IMAGES_HURT);
                    self.moveHorizontally();
                    break;
                case Endboss.STATES.DEAD:
                    clearInterval(animationInterval);
                    break;
            }
        }, 200);
    }

    /**
     * Moves the boss back and forth within a defined horizontal range.
     * @returns {void}
     */
    moveHorizontally() {
        this.x -= this.movementSpeed;
        const leftBoundary = this.startX - this.movementRange;
        if (this.x < leftBoundary) {
            this.x = leftBoundary;
            this.x += this.movementSpeed;
        } else if (this.x > this.startX) {
            this.x = this.startX;
        }
    }

    /**
     * Basic left movement used by WALK state.
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = false;
    }
}