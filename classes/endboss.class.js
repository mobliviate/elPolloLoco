class Endboss extends MovableObject {
    IMAGES_WALKING = [
        'img/4_enemie_boss_chicken/1_walk/G1.png',
        'img/4_enemie_boss_chicken/1_walk/G2.png',
        'img/4_enemie_boss_chicken/1_walk/G3.png',
        'img/4_enemie_boss_chicken/1_walk/G4.png',
    ];

    IMAGES_ALERT = [
        'img/4_enemie_boss_chicken/2_alert/G5.png',
        'img/4_enemie_boss_chicken/2_alert/G6.png',
        'img/4_enemie_boss_chicken/2_alert/G7.png',
        'img/4_enemie_boss_chicken/2_alert/G8.png',
        'img/4_enemie_boss_chicken/2_alert/G9.png',
        'img/4_enemie_boss_chicken/2_alert/G10.png',
        'img/4_enemie_boss_chicken/2_alert/G11.png',
        'img/4_enemie_boss_chicken/2_alert/G12.png',
    ];

    IMAGES_ATTACK = [
        'img/4_enemie_boss_chicken/3_attack/G13.png',
        'img/4_enemie_boss_chicken/3_attack/G14.png',
        'img/4_enemie_boss_chicken/3_attack/G15.png',
        'img/4_enemie_boss_chicken/3_attack/G16.png',
        'img/4_enemie_boss_chicken/3_attack/G17.png',
        'img/4_enemie_boss_chicken/3_attack/G18.png',
        'img/4_enemie_boss_chicken/3_attack/G19.png',
        'img/4_enemie_boss_chicken/3_attack/G20.png',
    ];

    IMAGES_HURT = [
        'img/4_enemie_boss_chicken/4_hurt/G21.png',
        'img/4_enemie_boss_chicken/4_hurt/G22.png',
        'img/4_enemie_boss_chicken/4_hurt/G23.png',
    ];

    static STATES = {
        ALERT: 'alert',
        WALK: 'walk',
        ATTACK: 'attack',
        HURT: 'hurt',
        DEAD: 'dead'
    };

    health = 5;
    isHurt = false;
    state = Endboss.STATES.ALERT;
    lastHitTime = 0;
    hurtCooldown = 1000; // 1 second cooldown between hits
    movementRange = 300; // How far the endboss moves left and right
    startX; // Will be set in constructor
    movingRight = true;
    movementSpeed = 6; // Movement speed

    constructor() {
        super().loadImg('img/4_enemie_boss_chicken/2_alert/G5.png');
        this.loadImages(this.IMAGES_ALERT);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_HURT);
        
        this.x = 2800;
        this.startX = this.x; // Set the starting position
        this.speed = 0.5;
        this.animate();
    }

    hit() {
        const now = Date.now();
        if (now - this.lastHitTime > this.hurtCooldown) {
            this.health--;
            this.lastHitTime = now;
            this.isHurt = true;
            
            // On first hit, transition to ATTACK state
            if (this.state !== Endboss.STATES.ATTACK && this.state !== Endboss.STATES.HURT) {
                this.state = Endboss.STATES.ATTACK;
                this.startX = this.x; // Reset movement boundaries
            }
            
            if (this.health <= 0) {
                this.defeated();
            } else {
                this.state = Endboss.STATES.HURT;
                setTimeout(() => {
                    this.isHurt = false;
                    this.state = Endboss.STATES.ATTACK;
                }, 500); // Short hurt animation
            }
            return true;
        }
        return false;
    }

    defeated() {
        this.state = Endboss.STATES.DEAD;
        // Show victory screen
        const victoryScreen = document.createElement('div');
        const canvas = document.getElementById('canvas');
        const rect = canvas.getBoundingClientRect();
        
        victoryScreen.style.position = 'absolute';
        victoryScreen.style.top = rect.top + 'px';
        victoryScreen.style.left = rect.left + 'px';
        victoryScreen.style.width = canvas.width + 'px';
        victoryScreen.style.height = canvas.height + 'px';
        victoryScreen.style.backgroundImage = 'url("img/You won, you lost/You Won B.png")';
        victoryScreen.style.backgroundSize = 'contain';
        victoryScreen.style.backgroundRepeat = 'no-repeat';
        victoryScreen.style.backgroundPosition = 'center';
        victoryScreen.style.backgroundColor = 'black';
        victoryScreen.style.zIndex = '1000';
        document.body.appendChild(victoryScreen);
    }

    gameOver() {
        const gameOverScreen = document.createElement('div');
        const canvas = document.getElementById('canvas');
        const rect = canvas.getBoundingClientRect();
        
        gameOverScreen.style.position = 'absolute';
        gameOverScreen.style.top = rect.top + 'px';
        gameOverScreen.style.left = rect.left + 'px';
        gameOverScreen.style.width = canvas.width + 'px';
        gameOverScreen.style.height = canvas.height + 'px';
        gameOverScreen.style.backgroundImage = 'url("img/You won, you lost/Game Over.png")';
        gameOverScreen.style.backgroundSize = 'contain';
        gameOverScreen.style.backgroundRepeat = 'no-repeat';
        gameOverScreen.style.backgroundPosition = 'center';
        gameOverScreen.style.backgroundColor = 'black';
        gameOverScreen.style.zIndex = '1000';
        document.body.appendChild(gameOverScreen);
    }

    animate() {
        // State-based behavior with 100ms interval for smoother animation
        setInterval(() => {
            switch (this.state) {
                case Endboss.STATES.ALERT:
                    this.playAnimation(this.IMAGES_ALERT);
                    // Stay in ALERT state until hit
                    break;
                    
                case Endboss.STATES.WALK:
                    this.playAnimation(this.IMAGES_WALKING);
                    this.moveLeft();
                    break;
                    
                case Endboss.STATES.ATTACK:
                    this.playAnimation(this.IMAGES_ATTACK);
                    this.moveHorizontally();
                    break;
                    
                case Endboss.STATES.HURT:
                    this.playAnimation(this.IMAGES_HURT);
                    this.moveHorizontally();
                    break;
                    
                case Endboss.STATES.DEAD:
                    // Stop moving when dead
                    break;
            }
        }, 200); // 100ms interval for smoother animation
    }
    
    faceCharacter() {
        if (this.world && this.world.character && this.world.character[0]) {
            const character = this.world.character[0];
            this.otherDirection = this.x > character.x;
        }
    }

    moveHorizontally() {
        // Always move left
        this.x -= this.movementSpeed;
        
        // Stay within movement boundaries
        const leftBoundary = this.startX - this.movementRange;
        if (this.x < leftBoundary) {
            this.x = leftBoundary;
            // Move right when hitting left boundary
            this.x += this.movementSpeed;
        } else if (this.x > this.startX) {
            this.x = this.startX;
        }
    }

    moveLeft() {
        this.x -= this.speed;
        this.otherDirection = false;
    }
}
