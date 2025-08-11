/**
 * Simple cloud object scrolling left across the sky.
 * Extends {@link MovableObject}.
 * @class
 */
class Cloud extends MovableObject {
    height = 400;
    width = 720;
    y = 0;
    moveInterval = null;

    /**
     * Creates a cloud with a default texture and position.
     * @constructor
     */
    constructor() {
        super().loadImg('./img/5_background/layers/4_clouds/1.png');
        this.x = 480;
    }

    /**
     * Starts continuous left movement if not already running.
     * @returns {void}
     */
    animate() {
        let self = this;
        if (this.moveInterval) return;
        this.moveInterval = setInterval(function () {
            self.moveLeft();
        }, 1000 / 60);
    }
}