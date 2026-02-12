export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, targetX, targetY) {
    super(scene, x, y, "enemy");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.scene = scene;

    this.setScale(0.7);

    this.health = 3;
    this.speed = 120;
    this.type = "chaser";

    this.targetX = targetX;
    this.targetY = targetY;
  }

  setType(type) {
    this.type = type;
    if (type === "chaser") {
      this.speed = 120;
      this.health = 3;
    } else if (type === "shooter") {
      this.speed = 80;
      this.health = 5;
    } else if (type === "boss") {
      const x = this.scale.width / 2;
      const y = 100;

      const boss = new Enemy(this, x, y, x, y + 50);
      boss.setType(this.currentWave.enemyTypes[0]); // normal type
      boss.health = this.currentWave.boss.health;
      boss.speed = this.currentWave.boss.speed;
      boss.setScale(this.currentWave.boss.scale || 1);

      this.enemies.add(boss);
      return; // skip normal spawn logic
    }

 }
  update(player) {
    if (this.type === "chaser") {
      this.scene.physics.moveToObject(this, player, this.speed);
    } else if (this.type === "shooter") {
      this.setVelocityY(this.speed * 0.5);
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
