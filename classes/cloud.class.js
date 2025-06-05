class Cloud extends MovableObject {
    height = 200;
    width = 500;
    constructor() {
        super().loadImg('./img/5_background/layers/4_clouds/1.png');

        this.x = 200 + Math.random() * 500;
        this.y = 30;
    }
}