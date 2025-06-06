class World {

    character = [new Character()];
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;



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

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);

        this.addObjectsToMap(this.level.clouds);

        this.addObjectsToMap(this.character);

        this.addObjectsToMap(this.level.enemies);
        
        this.ctx.translate(-this.camera_x, 0);





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
