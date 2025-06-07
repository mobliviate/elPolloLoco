class MovableObject {
    x = 0;
    y = 0;
    img;
    height = 480;
    width = 200;
    currentImage = 0;
    speed = 0.5;
    otherDirection = false;
    imageCache = {};
    speedY = 0;
    acceleration = 1;

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


    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(images) {
        let i = this.currentImage % this.IMAGES_WALKING.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight() {
        this.x += this.speed;
        this.otherDirection = false;
    }

    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = true;
    }

    jump() {
        this.speedY = 22;
    }


    constructor() {

    }
}
