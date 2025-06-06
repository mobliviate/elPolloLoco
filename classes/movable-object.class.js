class MovableObject {
    x = 0;
    y = 0;
    img;
    height = 480;
    width = 200;
    currentImage = 0;

    imageCache = {};


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

    moveRight() {
        console.log("moveRight");
    }

    moveLeft() {
        console.log("moveLeft");
    }


    constructor() {

    }
}
