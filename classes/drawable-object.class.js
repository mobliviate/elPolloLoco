/**
 * Base class for anything drawable on the canvas.
 * Holds common image loading and drawing utilities.
 * @class
 */
class DrawableObject {

    img;
    imageCache = {};
    currentImage = 0;
    height = 480;
    width = 200;
    x = 0;
    y = 0;

    /**
     * Creates a new drawable object.
     * @constructor
     */
    constructor() { }

    /**
     * Loads a single image into this object's main image.
     * @param {string} path - Image URL/path.
     * @returns {void}
     */
    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads multiple images into the cache for animation.
     * @param {string[]} arr - Array of image paths.
     * @returns {void}
     */
    loadImages(arr) {
        arr.forEach(function (path) {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        }.bind(this));
    }

    /**
     * Draws this drawable to the canvas.
     * @param {CanvasRenderingContext2D} ctx - Rendering context.
     * @returns {void}
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws a debug collision frame if DEBUG_MODE is enabled.
     * @param {CanvasRenderingContext2D} ctx - Rendering context.
     * @returns {void}
     */
    drawFrame(ctx) {
        if (!window.DEBUG_MODE) return;
        if (this instanceof Cloud || this instanceof StatusBar || this instanceof BackgroundObject) {
            return;
        }
        const offset = MovableObject.getHitboxOffset(this.constructor.name);

        ctx.beginPath();
        ctx.rect(
            this.x + offset.left,
            this.y + offset.top,
            this.width - offset.left - offset.right,
            this.height - offset.top - offset.bottom
        );
        ctx.strokeStyle = this instanceof Character ? 'lime' :
            this instanceof Endboss ? 'orange' :
                this instanceof Coin || this instanceof Bottle || this instanceof ThrowableObject ? 'orange' : 'red';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}