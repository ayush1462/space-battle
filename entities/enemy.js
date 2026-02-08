export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, targetX, targetY) {
    super(scene, x, y, "enemy");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;

    this.setScale(0.5);
    this.setAlpha(0);
    this.setAngle(Phaser.Math.Between(-180, 180));

    this.health = 3;
    this.state = "ENTERING";

    this.targetX = targetX;
    this.targetY = targetY;

    this.enterScene();
  }

  enterScene() {
    this.scene.tweens.add({
      targets: this,
      x: this.scene.scale.width / 2,
      y: 150,
      angle: 0,
      alpha: 1,
      duration: 700,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.scene.time.delayedCall(300, () => {
          this.scene.tweens.add({
            targets: this,
            x: this.targetX,
            y: this.targetY,
            duration: 600,
            ease: "Sine.easeInOut",
            onComplete: () => {
              this.state = "ATTACK";
            },
          });
        });
      },
    });
  }

  update(player) {
    if (this.state === "ATTACK") {
      this.scene.physics.moveToObject(this, player, 50);
    }
  }

  takeDamage() {
    this.health--;

    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.body.enable = false;
    this.setVisible(false);

    const explosion = this.scene.add.sprite(this.x, this.y, "blast_1_01");
    explosion.anims.play("enemyExplosion");

    explosion.on("animationcomplete", () => {
      explosion.destroy();
      this.destroy();
    });
  }
}
