/**
 * Static bottle pickup that increases throwable stock.
 * Extends {@link MovableObject}.
 * @class
 */
class Bottle extends MovableObject {
    height = 100;
    width = 100;
    y = 320;

    IMAGE_BOTTLE = 'img/6_salsa_bottle/salsa_bottle.png';

    /**
     * Creates a bottle at a given x coordinate.
     * @param {number} x - Horizontal position.
     */
    constructor(x) {
        super().loadImg(this.IMAGE_BOTTLE);
        this.x = x;
    }
}