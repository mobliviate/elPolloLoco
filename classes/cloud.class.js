class Cloud extends MovableObject {
    height = 400;
    width = 720;
    y = 0;
    constructor() {
        super().loadImg('./img/5_background/layers/4_clouds/1.png');

        this.x = 680;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= 0.25;
        }, 1000 / 60);
    }
}