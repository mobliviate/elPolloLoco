/**
 * A smaller, faster chicken enemy.
 * Extends {@link MovableObject}.
 * @class
 */
class ChickenSmall extends MovableObject {
    height = 60;
    width = 60;
    y = 380;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_small/2_dead/dead.png';

    isDead = false;
    animationInterval;
    moveInterval;

    /**
     * Creates a small chicken with randomized position and speed.
     * @constructor
     */
    constructor() {
        super().loadImg(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);

        this.x = 1000 + Math.random() * 2200;
        this.speed = 0.25 + Math.random() * 0.5;

        this.animate();
    }

    /**
     * Starts movement and walking animation loops.
     * @returns {void}
     */
    animate() {
        let self = this;
        this.moveInterval = setInterval(function () {
            if (!self.isDead) {
                self.moveLeft();
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(function () {
            if (!self.isDead) {
                self.playAnimation(self.IMAGES_WALKING);
            }
        }, 120);
    }

    /**
     * Marks the chicken as dead and stops timers.
     * @returns {void}
     */
    dead() {
        this.isDead = true;
        this.loadImg(this.IMAGE_DEAD);
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}