class ThrowableObject extends MovableObject {




    constructor(x, y, throwLeft = false) {
        super();
        this.loadImg('img/6_salsa_bottle/salsa_bottle.png');
        this.x = x;
        this.y = y;
        this.height = 100;
        this.width = 100;
        this.throw(throwLeft);
    }   
    
    throw(throwLeft) {
        this.speedY = 10;
        this.applyGravity();
        this.throwLeft = throwLeft;
        
        setInterval(() => {
            if (this.throwLeft) {
                this.x -= 5; // Move left if throwLeft is true
            } else {
                this.x += 5; // Move right if throwLeft is false
            }
        }, 10);
    }
}