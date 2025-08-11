/**
 * Container for all objects forming a level.
 * @class
 */
class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2876;
    coins;
    bottles;

    /**
     * Constructs a Level with all required object collections.
     * @param {MovableObject[]} enemies - Enemy objects (including endboss).
     * @param {Cloud[]} clouds - Cloud objects.
     * @param {BackgroundObject[]} backgroundObjects - Background layers.
     * @param {Coin[]} coins - Collectible coins.
     * @param {Bottle[]} bottles - Collectible bottles.
     */
    constructor(enemies, clouds, backgroundObjects, coins, bottles) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
        this.coins = coins;
        this.bottles = bottles;
    }
}