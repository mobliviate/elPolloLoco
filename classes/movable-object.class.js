class MovableObject {
    x = 0;
    y = 0;
    img;
    height = 480;
    width = 200;


    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
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
