import MenuScene from "/src/scenes/MenuScene.js";
import GameScene from "/src/scenes/GameScene.js";
import GameOverScene from "/src/scenes/GameOverScene.js";
const config = {
    type: Phaser.AUTO,
    pixelArt: true,
    width: 378,
    height: 672,
    backgroundColor: "#1e1e1e",
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [MenuScene, GameScene, GameOverScene],
};
export default config;