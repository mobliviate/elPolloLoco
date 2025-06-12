class ThrowableObject extends MovableObject {




    constructor(x, y) {
        super();
        this.loadImg('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 100;
        this.throw();

    }   



    
    throw() {
        this.speedY = 10;
        this.applyGravity();
        setInterval(() => {
            this.x += 5;
        }, 10);
    }
}