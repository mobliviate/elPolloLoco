class Bottle extends MovableObject {
    height = 100;
    width = 100;
    y = 320;

    IMAGE_BOTTLE = 'img/6_salsa_bottle/salsa_bottle.png';

    constructor(x) {
        super().loadImg(this.IMAGE_BOTTLE);
        this.x = x;
    }



}