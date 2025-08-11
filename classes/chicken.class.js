/**
 * Regular chicken enemy walking left until defeated.
 * Extends {@link MovableObject}.
 * @class
 */
class Chicken extends MovableObject {
    height = 100;
    width = 100;
    y = 360;

    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    isDead = false;
    animationInterval;
    moveInterval;

    /**
     * Creates a chicken with randomized position and speed.
     * @constructor
     */
    constructor() {
        super().loadImg(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImg(this.IMAGES_WALKING[0]);

        this.x = 800 + Math.random() * 2200;
        this.speed = 0.15 + Math.random() * 0.4;

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
        }, 100);
    }

    /**
     * Marks the chicken as dead and stops its timers.
     * @returns {void}
     */
    dead() {
        this.isDead = true;
        this.loadImg(this.IMAGE_DEAD);
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }
}