// classes/drawable-object.class.js
class DrawableObject {

    img;
    imageCache = {};
    currentImage = 0;
    height = 480;
    width = 200;
    x = 0;
    y = 0;

    constructor() {}

    /**
     * Loads single image.
     * @param {string} path 
     */
    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images into cache.
     * @param {string[]} arr 
     */
    loadImages(arr) {
        arr.forEach(function (path) {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        }.bind(this));
    }

    /**
     * Draws object to canvas.
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws debug frame if DEBUG_MODE is true.
     * @param {CanvasRenderingContext2D} ctx 
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