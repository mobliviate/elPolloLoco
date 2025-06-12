class DrawableObject {

    img;
    imageCache = {};
    currentImage = 0;
    height = 480;
    width = 200;
    x = 0;
    y = 0;


    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
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
                          this instanceof Coin || this instanceof Bottle || this instanceof ThrowableObject ? 'orange':
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    constructor() {
        
    }

}
    
