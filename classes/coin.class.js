/**
 * Represents a collectible coin in the game world.
 * Extends {@link MovableObject}.
 * @class
 */
class Coin extends MovableObject {
    height = 100;
    width = 100; 
    y = 100 + Math.random() * 250;
    x = Math.random() * 250;

    IMAGES_COIN = [
        './img/8_coin/coin_1.png',
        './img/8_coin/coin_2.png'
    ];

    /**
     * Creates a coin at a given x position.
     * @param {number} x - The horizontal coordinate of the coin.
     */
    constructor(x) {
        super().loadImg(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.animate();
    }

    /**
     * Starts the coin's animation loop (simple frame toggle).
     * @returns {void}
     */
    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200);
    }
}