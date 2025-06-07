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
        if (this instanceof Character || this instanceof Endboss || this instanceof Chicken) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    constructor() {
        
    }

}
    
