class Character extends MovableObject {

    height = 480;
    width = 200;
    y = 0;
    x = 0;
    speed = 10;
    isDeadAnimationPlayed = false;


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
        'img/2_character_pepe/3_jump/J-39.png',
    ];

    IMAGES_HURT = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png',
    ];

    IMAGES_DEAD = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png',
    ];

    world;
    otherDirection = false; // false = right, true = left

    dead() {
        return this.energy <= 0;
    }
    
    async playDeathAnimation() {
        if (this.isDeadAnimationPlayed) return;
        
        this.isDeadAnimationPlayed = true;
        this.canMove = false;
        this.speed = 0;
        
        // Play death animation
        for (let i = 0; i < this.IMAGES_DEAD.length; i++) {
            this.img = this.imageCache[this.IMAGES_DEAD[i]];
            await new Promise(resolve => setTimeout(resolve, 100)); // 100ms per frame
        }
        
        // After death animation completes, show game over
        const endboss = this.world?.level?.enemies?.find(enemy => enemy instanceof Endboss);
        if (endboss?.gameOver) {
            endboss.gameOver();
        }
    }

    isColliding(other, offset = {top: 190, bottom: 30, left: 55, right: 55}) {
        return (
            this.x + offset.left < other.x + other.width &&
            this.x + this.width - offset.right > other.x &&
            this.y + offset.top < other.y + other.height &&
            this.y + this.height - offset.bottom > other.y
        );
    }


    constructor() {
        super().loadImg('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);

        this.animate();
        this.applyGravity();

    }



    animate() {

        setInterval(() => {

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }

            if (this.world.keyboard.LEFT && this.x > -2776) {
                this.moveLeft();
                this.otherDirection = true;

            }

            if (this.world.keyboard.UP && this.isAboveGround() == false) {
                this.jump();
            }

            this.world.camera_x = -this.x + 100;
        }, 10);

        setInterval(() => {
            if (this.dead()) {
                if (!this.isDeadAnimationPlayed) {
                    this.playDeathAnimation();
                }
            } else if (this.isHurt()) {
                this.playAnimation(this.IMAGES_HURT);   
            } else if (this.isAboveGround()) {
                this.playAnimation(this.IMAGES_JUMPING);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.playAnimation(this.IMAGES_WALKING);
                }
            }
        }, 200);
    }

}