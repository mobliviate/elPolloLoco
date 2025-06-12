class Chicken extends MovableObject {
    height = 100;
    width = 100;
    y = 360;
    IMAGES_WALKING = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png',
    ];

    IMAGE_DEAD = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    isDead = false;
    animationInterval;
    moveInterval;

    constructor() {
        super().loadImg(this.IMAGES_WALKING[0]);
        this.loadImages(this.IMAGES_WALKING);

        this.x = 250 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 0.4;

        this.animate();
    }

    animate() {
        this.moveInterval = setInterval(() => {
            if (!this.isDead) {
                this.moveLeft();
            }
        }, 1000 / 60);

        this.animationInterval = setInterval(() => {
            if (!this.isDead) {
                this.playAnimation(this.IMAGES_WALKING);
            }
        }, 100);
    }

    dead() {
        this.isDead = true;
        this.loadImg(this.IMAGE_DEAD);
        clearInterval(this.moveInterval);
        clearInterval(this.animationInterval);
    }   
}   