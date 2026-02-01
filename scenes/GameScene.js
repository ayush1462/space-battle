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
    this.player = this.physics.add.sprite(180, 600, "player");
    this.player.setInteractive();
    this.input.setDraggable(this.player);
    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    this.player.setVelocityX(0);
    this.player.setCollideWorldBounds(true);
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
      callback: shoot,
      callbackScope: this,
      loop: true,
    });
    function shoot() {
      let bullet = this.bullets.get(
        this.player.x,
        this.player.y - 20,
        "bullet"
      );
      if (!bullet) return;
      bullet.setActive(true);
      bullet.setVisible(true);
      bullet.body.enable = true;
      bullet.setVelocityY(-400);
    }
    
    this.physics.add.overlap(this.bullets, this.enemies, this.enemyShot, null, this);
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
    const enemy = this.enemies.create(spawnX, spawnY, "enemy");
    enemy.setScale(0.5);
    enemy.setAlpha(0);
    enemy.setAngle(Phaser.Math.Between(-180, 180));
    enemy.health = 3;
    enemy.isDying = false;
    enemy.targetX = targetX;
    enemy.targetY = targetY;
    enemy.state = "ENTERING";
    this.tweens.add({
      targets: enemy,
      x: this.scale.width / 2,
      y: 150,
      angle: 0,
      alpha: 1,
      duration: 700,
      ease: "Sine.easeOut",
      onComplete: () => {
        this.time.delayedCall(300, () => {
          this.tweens.add({
            targets: enemy,
            x: enemy.targetX,
            y: enemy.targetY,
            duration: 600,
            ease: "Sine.easeInOut",
            onComplete: () => {
              enemy.state = "HOLD";
            }
          });
        });
      }
    });
  }
  enemyShot(bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.body.enable = false;
    enemy.setVisible = false;
    let explosion = this.add.sprite(enemy.x, enemy.y, "blast_1_01");
    explosion.anims.play("enemyExplosion");
    explosion.on("animationcomplete", () => {
      explosion.destroy();
      enemy.destroy();
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
  }
}
