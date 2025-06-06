class Character extends MovableObject {

    height = 480;
    width = 200;
    y = 0;
    x = 0;
    speed = 10;

    IMAGES_WALKING = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];
    world;
    

    constructor() {
        super().loadImg('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_WALKING);

        this.animate();

    }

    animate() {


        setInterval(() => {

            if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
            }
            
            if (this.world.keyboard.LEFT && this.x > -2776) {
                this.x -= this.speed;
                this.otherDirection = true;
            }
            this.world.camera_x = -this.x + 100;
        }, 10);

        setInterval(() => {

        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
           
            let i = this.currentImage % this.IMAGES_WALKING.length;
            let path = this.IMAGES_WALKING[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }
    }, 100);

    }

    jump() {
        console.log("jump");
    }
}