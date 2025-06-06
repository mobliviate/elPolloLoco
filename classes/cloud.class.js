class Cloud extends MovableObject {
    height = 400;
    width = 720;
    constructor() {
        super().loadImg('./img/5_background/layers/4_clouds/1.png');

        this.x = 200 + Math.random() * 500;
        this.y = 0;
    }
}