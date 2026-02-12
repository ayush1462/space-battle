import Player from "../entities/Player.js";
import Enemy from "../entities/Enemy.js";

import {Levels} from "../levels/levelData.js"
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
  init(data) {
    this.levelIndex = data.levelIndex || 0;
    this.level = Levels[this.levelIndex];
    this.currentWaveIndex = 0;
    this.currentWave = null;
  }
  create() {
    this.add.image(300, 300, "bg");
    this.player = new Player(this, 180, 600);
    this.player.setInteractive();
    this.player.enableDrag();
    this.cursors = this.input.keyboard.createCursorKeys();
    console.log(this.player.x);
    this.enemies = this.physics.add.group();
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
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.gameOver,
      null,
      this
    );
    this.physics.add.collider(this.enemies, this.enemies);
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

    this.startWave();
  }
  startWave() {
    this.currentWave = this.level.waves[this.currentWaveIndex];

    if (!this.currentWave) {
      this.levelComplete();
      return;
    }

    this.spawnTimer = this.time.addEvent({
      delay: this.currentWave.spawnInterval,
      loop: true,
      callback: () => {
        if (this.enemies.countActive(true) < this.currentWave.maxAlive) {
          this.spawnEnemyFromWave();
        }
      },
    });

    if (this.currentWave.duration) {
      this.time.delayedCall(this.currentWave.duration, () => this.endWave());
    }
    console.log(`Wave ${this.currentWaveIndex + 1} started`);
  }
  spawnEnemyFromWave() {
    const types = this.currentWave.enemyTypes;
    const type = types[Phaser.Math.Between(0, types.length - 1)];

    const spawnX = Phaser.Math.Between(50, this.scale.width - 50);
    const spawnY = -60;

    const targetY = Phaser.Math.Between(100, 250);
    const enemy = new Enemy(this, spawnX, spawnY, spawnX, targetY);
    enemy.setType(type);
    this.enemies.add(enemy);
  }
  endWave() {
    if (this.spawnTimer) this.spawnTimer.remove(false);
    this.currentWaveIndex++;
    if (this.currentWaveIndex < this.level.waves.length) {
      this.startWave();
    } else {
      this.levelComplete();
    }
  }

  levelComplete() {
    console.log("Level Complete");
    this.scene.restart({ levelIndex: this.levelIndex + 1 });
  }
  enemyHitEvent(bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.takeDamage();

    if (enemy.type==="boss" && enemy.health<=0) {
      this.endWave();
    }
  }
  gameOver() {
    this.player.takeDamage(100);
    this.enemies.children.iterate((enemy) => {
      enemy.setVelocity(0, 0);
      enemy.body.enable = false;
    });

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
