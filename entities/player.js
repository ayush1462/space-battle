export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;

    this.health = 100;
    this.maxHealth = 100;

    this.fireRate = 50;
    this.lastShotTime = 0;

    this.setCollideWorldBounds(true);
  }

  enableDrag() {
    this.scene.input.setDraggable(this);

    this.scene.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      if (gameObject === this) {
        this.setPosition(dragX, dragY);
      }
    });
  }
  handleKeyboard(cursors) {
    if (cursors.left.isDown) {
      this.setVelocityX(-100);
    } else if (cursors.right.isDown) {
      this.setVelocityX(100);
    } else {
      this.setVelocityX(0);
    }
  }
  shoot(bulletsGroup) {
    const now = this.scene.time.now;
    if (now - this.lastShot < this.fireRate) return;
    this.lastShot = now;

    const bullet = bulletsGroup.get(this.x, this.y - 20, "bullet");
    if (!bullet) return;

    bullet.setActive(true);
    bullet.setVisible(true);
    bullet.body.enable = true;
    bullet.setVelocityY(-400);
  }
}
