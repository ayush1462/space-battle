export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }

  preload() {
    this.load.image("bg", "./assets/BG.png");
  }
  create() {
    this.add.image(300, 300, "bg");
  }
}
