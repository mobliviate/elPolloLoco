class MovableObject extends DrawableObject {

    speed = 0.5;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;

    static hitboxOffsets = {
        Character: { top: 190, bottom: 30, left: 55, right: 55 },
        Endboss: { top: 70, bottom: 20, left: 20, right: 20 },
        Coin: { top: 40, bottom: 40, left: 40, right: 40 },
        Bottle: { top: 10, bottom: 10, left: 40, right: 40 },
        ThrowableObject: { top: 10, bottom: 10, left: 40, right: 40 },
        Chicken: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    static getHitboxOffset(className) {
        return this.hitboxOffsets[className] || { top: 0, bottom: 0, left: 0, right: 0 };
    }

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.speedY -= this.acceleration;
                this.y -= this.speedY;
            }

        }, 1000 / 50);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 0;
        }
    }


    isColliding(other, thisOffset = MovableObject.getHitboxOffset(this.constructor.name), otherOffset = MovableObject.getHitboxOffset(other.constructor.name)) {
        return (
            this.x + thisOffset.left < other.x + other.width - otherOffset.right &&
            this.x + this.width - thisOffset.right > other.x + otherOffset.left &&
            this.y + thisOffset.top < other.y + other.height - otherOffset.bottom &&
            this.y + this.height - thisOffset.bottom > other.y + otherOffset.top
        );
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;

    }

    moveLeft() {
        this.x -= this.speed;

    }

    jump() {
        this.speedY = 22;
    }

    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return timepassed < 1000;
    }

    dead() {
        return this.energy == 0;
    }


    constructor() {
        super();
    }
}
