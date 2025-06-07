class StatusBar extends DrawableObject {

    IMAGES_HEALTH = [
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png',
        'img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png'
    ];

    IMAGES_COIN = [
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png',
        'img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png'
    ];

    IMAGES_BOTTLE = [
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/0.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/20.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/40.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/60.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png',
        'img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png'
    ];

    percentage_health = 100;
    percentage_coin = 0;
    percentage_bottle = 100;

    constructor(type, yPosition) {
        super();
        this.type = type;
        this.y = yPosition;
        this.x = 0;

        if (type === 'health') {
            this.loadImages(this.IMAGES_HEALTH);
            this.updateHealthBar(this.percentage_health);
        } else if (type === 'coin') {
            this.loadImages(this.IMAGES_COIN);
            this.updateCoinBar(this.percentage_coin);
        } else if (type === 'bottle') {
            this.loadImages(this.IMAGES_BOTTLE);
            this.updateBottleBar(this.percentage_bottle);
        }

        this.width = 200;
        this.height = 50;

    }

    updateHealthBar(percentage_health) {
        this.percentage_health = percentage_health;
        if (percentage_health < 0) {
            percentage_health = 0;
        }

        let i = Math.floor(percentage_health / 20);
        console.log(i);
        let path = this.IMAGES_HEALTH[i];
        this.img = this.imageCache[path];
    }

    updateCoinBar(percentage_coin) {
        this.percentage_coin = percentage_coin;
        if (percentage_coin < 0) {
            percentage_coin = 0;
        }

        let i = Math.floor(percentage_coin / 20);
        let path = this.IMAGES_COIN[i];
        this.img = this.imageCache[path];
    }

    updateBottleBar(percentage_bottle) {
        this.percentage_bottle = percentage_bottle;
        if (percentage_bottle < 0) {
            percentage_bottle = 0;
        }

        let i = Math.floor(percentage_bottle / 20);
        let path = this.IMAGES_BOTTLE[i];
        this.img = this.imageCache[path];
    }

}
