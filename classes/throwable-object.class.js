// classes/throwable-object.class.js

/**
 * Throwable salsa bottle with rotation and splash animation.
 * Extends {@link MovableObject}.
 * @class
 */
class ThrowableObject extends MovableObject {

    rotationImages = [
        'img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    splashImages = [
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    isSplashing = false;
    throwLeft = false;

    /**
     * Creates a throwable bottle instance.
     * @param {number} x - Start X position.
     * @param {number} y - Start Y position.
     * @param {boolean} throwLeft - Direction of throw (true = left).
     */
    constructor(x, y, throwLeft) {
        super();
        this.loadImg('img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.rotationImages);
        this.loadImages(this.splashImages);
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 100;
        this.throwLeft = throwLeft;
        this.throw();
    }

    /**
     * Initiates the projectile physics and rotation.
     * @returns {void}
     */
    throw() {
        this.speedY = 10;
        this.applyGravity();
        this.animateRotation();

        let self = this;
        setInterval(function () {
            if (self.isSplashing) return;
            if (self.throwLeft) {
                self.x -= 5;
            } else {
                self.x += 5;
            }
            if (self.y > 360) {
                self.startSplash();
            }
        }, 10);
    }

    /**
     * Loops through rotation images during flight.
     * @returns {void}
     */
    animateRotation() {
        let self = this;
        setInterval(function () {
            if (self.isSplashing) return;
            self.playAnimation(self.rotationImages);
        }, 60);
    }

    /**
     * Executes the splash animation and stops updates when done.
     * @returns {void}
     */
    startSplash() {
        this.isSplashing = true;
        let i = 0;
        let self = this;
        let splashInterval = setInterval(function () {
            if (i < self.splashImages.length) {
                self.img = self.imageCache[self.splashImages[i]];
                i++;
            } else {
                clearInterval(splashInterval);
            }
        }, 80);
    }
}