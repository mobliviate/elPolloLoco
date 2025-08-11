/**
 * Base for movable entities with physics, animation and collisions.
 * Extends {@link DrawableObject}.
 * @class
 */
class MovableObject extends DrawableObject {

    speed = 0.5;
    otherDirection = false;
    speedY = 0;
    acceleration = 1;
    energy = 100;
    lastHit = 0;

    /**
     * Predefined hitbox offsets per class name.
     * @type {Record<string, {top:number,bottom:number,left:number,right:number}>}
     */
    static hitboxOffsets = {
        Character: { top: 190, bottom: 30, left: 55, right: 55 },
        Endboss: { top: 70, bottom: 20, left: 20, right: 20 },
        Coin: { top: 40, bottom: 40, left: 40, right: 40 },
        Bottle: { top: 10, bottom: 10, left: 40, right: 40 },
        ThrowableObject: { top: 10, bottom: 10, left: 40, right: 40 },
        Chicken: { top: 0, bottom: 0, left: 0, right: 0 },
    };

    /**
     * Returns the hitbox offset by class name, or a zero offset.
     * @param {string} className - Constructor name of the object.
     * @returns {{top:number,bottom:number,left:number,right:number}} Offsets.
     */
    static getHitboxOffset(className) {
        return this.hitboxOffsets[className] || { top: 0, bottom: 0, left: 0, right: 0 };
    }

    /**
     * Applies vertical gravity updates at a fixed interval.
     * @returns {void}
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.speedY -= this.acceleration;
                this.y -= this.speedY;
            }

        }, 1000 / 50);
    }

    /**
     * Checks if object is above the ground plane.
     * @returns {boolean} True if airborne (or always for projectiles).
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 0;
        }
    }

    /**
     * Axis-aligned bounding box collision detection with offsets.
     * @param {MovableObject|DrawableObject} other - The other object.
     * @param {{top:number,bottom:number,left:number,right:number}} [thisOffset] - Optional custom offset for this object.
     * @param {{top:number,bottom:number,left:number,right:number}} [otherOffset] - Optional custom offset for other object.
     * @returns {boolean} True if rectangles intersect.
     */
    isColliding(other, thisOffset = MovableObject.getHitboxOffset(this.constructor.name), otherOffset = MovableObject.getHitboxOffset(other.constructor.name)) {
        return (
            this.x + thisOffset.left < other.x + other.width - otherOffset.right &&
            this.x + this.width - thisOffset.right > other.x + otherOffset.left &&
            this.y + thisOffset.top < other.y + other.height - otherOffset.bottom &&
            this.y + this.height - thisOffset.bottom > other.y + otherOffset.top
        );
    }

    /**
     * Advances the sprite animation by one frame.
     * @param {string[]} images - List of frame paths.
     * @returns {void}
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Moves the object to the right by its speed.
     * @returns {void}
     */
    moveRight() {
        this.x += this.speed;

    }

    /**
     * Moves the object to the left by its speed.
     * @returns {void}
     */
    moveLeft() {
        this.x -= this.speed;

    }

    /**
     * Initiates a jump by applying an upward velocity.
     * @returns {void}
     */
    jump() {
        this.speedY = 22;
    }

    /**
     * Applies damage to this object and sets a hurt timestamp.
     * @returns {void}
     */
    hit() {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Returns whether the object is in the recent hurt cooldown.
     * @returns {boolean} True if last hit was within 1s.
     */
    isHurt() {
        let timepassed = new Date().getTime() - this.lastHit;
        return timepassed < 1000;
    }

    /**
     * Indicates if the object has no energy left.
     * @returns {boolean} True if energy equals zero.
     */
    dead() {
        return this.energy == 0;
    }

    /**
     * Constructs a movable object and initializes base state.
     * @constructor
     */
    constructor() {
        super();
    }
}