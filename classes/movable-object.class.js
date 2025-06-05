class MovableObject {
    x = 50;
    y = 300;
    img;
    height = 150;
    width = 100;


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
