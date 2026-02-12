export default class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }
    preload() {
        this.load.image("bg", "./assets/BG.png");
    }
    create() {
        this.add.image(300, 400, "bg");
        this.add.text(175, 400, "PLAY").setInteractive().on("pointerdown", () => {
            this.scene.start("GameScene");
        })
    }
}