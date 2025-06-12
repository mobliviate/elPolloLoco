class Coin extends MovableObject {
    height = 100;
    width = 100; 
    y = 100 + Math.random() * 250;
    x = Math.random() * 250;

    IMAGES_COIN = [
        './img/8_coin/coin_1.png',
        './img/8_coin/coin_2.png'
    ];


    constructor(x) {
        super().loadImg(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = x;
        this.animate();
    }



    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_COIN);
        }, 200);
    }
}