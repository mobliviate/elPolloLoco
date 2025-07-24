// classes/throwable-object.class.js
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
     * @param {number} x 
     * @param {number} y 
     * @param {boolean} throwLeft 
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
     * Starts throw physics and rotation.
     * @param {boolean} throwLeft 
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
     * Rotates bottle during flight.
     */
    animateRotation() {
        let self = this;
        setInterval(function () {
            if (self.isSplashing) return;
            self.playAnimation(self.rotationImages);
        }, 60);
    }

    /**
     * Plays splash animation and marks as finished.
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