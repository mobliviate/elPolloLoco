class World {

    character = [new Character()];
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusBarHealth = new StatusBar('health', 0);
    statusBarCoin = new StatusBar('coin', 40);
    statusBarBottle = new StatusBar('bottle', 80);



    constructor(canvas, keyboard) {
        this.keyboard = keyboard;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.draw();
        this.setWorld();
        this.checkCollisions();
    }

    setWorld() {
        this.character[0].world = this;
    }

    checkCollisions() {
        setInterval(() => {
            this.level.enemies.forEach((enemy) => {
                if (this.character[0].isColliding(enemy)) {
                    this.character[0].hit();
                    this.statusBarHealth.updateHealthBar(this.character[0].energy);

                    if (this.character[0].energy <= 0) {
                        this.character[0].dead();
                    }
                }
            });
        }, 100);
    }

    draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.translate(this.camera_x, 0);

            this.addObjectsToMap(this.level.backgroundObjects);

            this.addObjectsToMap(this.level.clouds);

            this.ctx.translate(-this.camera_x, 0);
            this.addToMap(this.statusBarHealth);
            this.addToMap(this.statusBarCoin);
            this.addToMap(this.statusBarBottle);
            this.ctx.translate(this.camera_x, 0);

            this.addObjectsToMap(this.character);

            this.addObjectsToMap(this.level.enemies);

            this.ctx.translate(-this.camera_x, 0);


            let self = this;
            requestAnimationFrame(function() {
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
            this.flipImage(movableObject);
        }

        movableObject.draw(this.ctx);
        movableObject.drawFrame(this.ctx);

        if (movableObject.otherDirection) {
            this.flipImageBack(movableObject);
        }
    }

    flipImage(movableObject) {
        this.ctx.save();
        this.ctx.translate(movableObject.width, 0);
        this.ctx.scale(-1, 1);
        movableObject.x = -movableObject.x;
    }

    flipImageBack(movableObject) {
        movableObject.x = -movableObject.x;
        this.ctx.restore();

    }
}
