class Character extends MovableObject {



    jump() {
        console.log("jump");
    }

    constructor() {
        super().loadImg('./img/2_character_pepe/2_walk/W-21.png');

        this.width = 200;
        this.x = 0;
        this.y = 0;

    }
}