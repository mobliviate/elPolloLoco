class MovableObject extends DrawableObject {

    speed = 0.5;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.speedY -= this.acceleration;
                this.y -= this.speedY;
            }

        }, 1000 / 50);
    }

    isAboveGround() {
        return this.y < 0;
    }


    isColliding(movableObject) {
        return (
            this.x < movableObject.x + movableObject.width &&
            this.x + this.width > movableObject.x &&
            this.y < movableObject.y + movableObject.height &&
            this.y + this.height > movableObject.y
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
