/**
 * A static parallax background layer object.
 * Extends {@link MovableObject}.
 * @class
 */
class BackgroundObject extends MovableObject {
    width = 720;
    height = 480;
    
        /**
         * Creates a background object with a given image and position.
         * @param {string} imagePath - Image path for the layer.
         * @param {number} x - Horizontal position.
         * @param {number} y - Vertical position.
         */
        constructor(imagePath, x, y) {
            super().loadImg(imagePath);
            this.x = x;
            this.y = y;
        }
    }