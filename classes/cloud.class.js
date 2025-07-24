// classes/cloud.class.js
class Cloud extends MovableObject {
    height = 400;
    width = 720;
    y = 0;
    moveInterval = null;

    constructor() {
        super().loadImg('./img/5_background/layers/4_clouds/1.png');
        this.x = 480;
    }

    animate() {
        let self = this;
        if (this.moveInterval) return;
        this.moveInterval = setInterval(function () {
            self.moveLeft();
        }, 1000 / 60);
    }
}