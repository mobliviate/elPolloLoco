class Chicken extends MovableObject {
    height = 150;
    width = 100;
    y = 320;

    constructor() {
        super().loadImg('./img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');

        this.x = 200 + Math.random() * 500;
        
    }
}   