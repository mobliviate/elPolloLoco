// levels/level1.js

/**
 * Creates and returns the first level configuration with enemies,
 * clouds, parallax backgrounds, coins and bottles.
 * @returns {Level} The configured level instance.
 */
function createLevel1() {
    return new Level(
        [
            new Chicken(),
            new Chicken(),
            new ChickenSmall(),
            new ChickenSmall(),
            new Endboss()
        ],
        [
            new Cloud()
        ],
        [
            new BackgroundObject('./img/5_background/layers/air.png', -2876, 0),
            new BackgroundObject('./img/5_background/layers/3_third_layer/1.png', -2876, 0),
            new BackgroundObject('./img/5_background/layers/2_second_layer/1.png', -2876, 0),
            new BackgroundObject('./img/5_background/layers/1_first_layer/1.png', -2876, 0),

            new BackgroundObject('./img/5_background/layers/air.png', -2157, 0),
            new BackgroundObject('./img/5_background/layers/3_third_layer/2.png', -2157, 0),
            new BackgroundObject('./img/5_background/layers/2_second_layer/2.png', -2157, 0),
            new BackgroundObject('./img/5_background/layers/1_first_layer/2.png', -2157, 0),

            new BackgroundObject('./img/5_background/layers/air.png', -1438, 0),
            new BackgroundObject('./img/5_background/layers/3_third_layer/1.png', -1438, 0),
            new BackgroundObject('./img/5_background/layers/2_second_layer/1.png', -1438, 0),
            new BackgroundObject('./img/5_background/layers/1_first_layer/1.png', -1438, 0),

            new BackgroundObject('./img/5_background/layers/air.png', -719, 0),
            new BackgroundObject('./img/5_background/layers/3_third_layer/2.png', -719, 0),
            new BackgroundObject('./img/5_background/layers/2_second_layer/2.png', -719, 0),
            new BackgroundObject('./img/5_background/layers/1_first_layer/2.png', -719, 0),

            new BackgroundObject('./img/5_background/layers/air.png', 0, 0),
            new BackgroundObject('./img/5_background/layers/3_third_layer/1.png', 0, 0),
            new BackgroundObject('./img/5_background/layers/2_second_layer/1.png', 0, 0),
            new BackgroundObject('./img/5_background/layers/1_first_layer/1.png', 0, 0),

            new BackgroundObject('./img/5_background/layers/air.png', 719, 0),
            new BackgroundObject('./img/5_background/layers/3_third_layer/2.png', 719, 0),
            new BackgroundObject('./img/5_background/layers/2_second_layer/2.png', 719, 0),
            new BackgroundObject('./img/5_background/layers/1_first_layer/2.png', 719, 0),

            new BackgroundObject('./img/5_background/layers/air.png', 1438, 0),
            new BackgroundObject('./img/5_background/layers/3_third_layer/1.png', 1438, 0),
            new BackgroundObject('./img/5_background/layers/2_second_layer/1.png', 1438, 0),
            new BackgroundObject('./img/5_background/layers/1_first_layer/1.png', 1438, 0),

            new BackgroundObject('./img/5_background/layers/air.png', 2157, 0),
            new BackgroundObject('./img/5_background/layers/3_third_layer/2.png', 2157, 0),
            new BackgroundObject('./img/5_background/layers/2_second_layer/2.png', 2157, 0),
            new BackgroundObject('./img/5_background/layers/1_first_layer/2.png', 2157, 0),

            new BackgroundObject('./img/5_background/layers/air.png', 2876, 0),
            new BackgroundObject('./img/5_background/layers/3_third_layer/1.png', 2876, 0),
            new BackgroundObject('./img/5_background/layers/2_second_layer/1.png', 2876, 0),
            new BackgroundObject('./img/5_background/layers/1_first_layer/1.png', 2876, 0)
        ],
        Array.from({ length: 10 }, function () { return new Coin(200 + Math.random() * 2600); }),
        Array.from({ length: 10 }, function () { return new Bottle(200 + Math.random() * 2600); })
    );
}