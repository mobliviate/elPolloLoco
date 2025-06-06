class World {
    character = [new Character()];
    enemies = [new Chicken(), new Chicken(), new Chicken()];
    clouds = [new Cloud()];
    backgroundObjects = [
        new BackgroundObject('./img/5_background/layers/air.png', 0, 0),
        new BackgroundObject('./img/5_background/layers/3_third_layer/1.png', 0, 0),
        new BackgroundObject('./img/5_background/layers/2_second_layer/1.png', 0, 0),
        new BackgroundObject('./img/5_background/layers/1_first_layer/1.png', 0, 0),

    ];

    canvas;
    ctx;
    keyboard;



    constructor(canvas, keyboard) {
        this.keyboard = keyboard;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.draw();
        this.setWorld();
    }

    setWorld() {
        this.character[0].world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.addObjectsToMap(this.backgroundObjects);

        this.addObjectsToMap(this.clouds);

        this.addObjectsToMap(this.character);

        this.addObjectsToMap(this.enemies);





        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(object => {
            this.addToMap(object);
        });
    }

    addToMap(movableObject) {
        if (movableObject.otherDirection) {
            this.ctx.save();
            this.ctx.translate(movableObject.width, 0);
            this.ctx.scale(-1, 1);
            movableObject.x = -movableObject.x;
        }
        this.ctx.drawImage(movableObject.img, movableObject.x, movableObject.y, movableObject.width, movableObject.height);
        if (movableObject.otherDirection) {
            this.ctx.restore();
            movableObject.x = -movableObject.x;
        }
    }
}
