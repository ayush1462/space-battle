
import Player from "../entities/Player.js";
import Enemy from "../entities/Enemy.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("bg", "./assets/BG.png");
    this.load.image("player", "./assets/Player/player-0.png");
    this.load.image("bullet", "./assets/Bullets/vulcan_2.png");
    this.load.image("enemy", "./assets/Enemies/enemy_1_r_m.png");
    for (let i = 1; i <= 9; i++) {
      this.load.image(
        `blast_1_0${i}`,
        `./assets/Animation/explosion_2_0${i}.png`
      );
    }
  }
  create() {
    this.add.image(300, 300, "bg");
    this.player = new Player(this, 180, 600);
    this.player.setInteractive();
    this.player.enableDrag();
    this.cursors = this.input.keyboard.createCursorKeys();
    console.log(this.player.x);
    this.enemies = this.physics.add.group();
    this.enemyArcFormation(20);
    this.bullets = this.physics.add.group({
      maxSize: 100,
      allowGravity: false,
    });
    this.shootEvent = this.time.addEvent({
      delay: 100,
      callback: () => this.player.shoot(this.bullets),
      loop: true,
    });

    this.physics.add.overlap(
      this.bullets,
      this.enemies,
      this.enemyHitEvent,
      null,
      this
    );
    this.anims.create({
      key: "enemyExplosion",
      frames: [
        { key: "blast_1_01" },
        { key: "blast_1_02" },
        { key: "blast_1_03" },
        { key: "blast_1_04" },
        { key: "blast_1_05" },
        { key: "blast_1_06" },
        { key: "blast_1_07" },
        { key: "blast_1_08" },
        { key: "blast_1_09" },
      ],
      frameRate: 25,
      repeat: 0,
    });
  }
  enemyArcFormation(enemyCount = 12) {
    const centerX = this.scale.width / 2;
    const centerY = 200;
    const radius = 170;
    const startAngle = Phaser.Math.DegToRad(-90);
    const endAngle = Phaser.Math.DegToRad(250);
    const angleStep = (endAngle - startAngle) / (enemyCount - 1);
    for (let i = 0; i < enemyCount; i++) {
      const angle = startAngle + angleStep * i;
      const targetX = centerX + Math.cos(angle) * radius;
      const targetY = centerY + Math.sin(angle) * radius;
      this.time.delayedCall(i * 120, () => {
        this.addEnemy(targetX, targetY);
      });
    }
  }
  addEnemy(targetX, targetY) {
    const spawnX = Phaser.Math.Between(50, this.scale.width - 50);
    const spawnY = -60;

    const enemy = new Enemy(this, spawnX, spawnY, targetX, targetY);
    this.enemies.add(enemy);
  }

  enemyHitEvent(bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.takeDamage();
  }

  enemyAttack(enemy) {
    this.physics.moveToObject(enemy, this.player, 0.5);
  }
  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-50);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(50);
    } else {
      this.player.setVelocityX(0);
    }
    this.bullets.children.each((bullet) => {
      if (!bullet) return;
      if (bullet.active && bullet.y < -50) {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.body.enable = false;
      }
    });
    this.enemies.children.each((enemy) => {
      if (enemy && enemy.active) {
        enemy.update(this.player);
      }
    });
  }
}
