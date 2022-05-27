//import game from "./game";

var player;
var platforms;
var cursors;
var cjump;
var level1music;
var flowerbed;
var score = 0;
var stars;
var ccoin;
var gameOver = false;
var cursors;
var bombs;
var playerLives = 3;
var scoreTextCurrent;
var livesTextCurrent;
var powerUpTimer;
var powerUpDeath;
var powerUpImmortality;
var time = new Date();
var seconds = time.getSeconds();
var text;
var timedEvent;
var gameOverSound;
var gameOverText0;
var gameOverText1;
var sceneRestart = 0;
var timedEvent2;
var timerTextCurrent;

function formatTime(seconds) {
  var minutes = Math.floor(seconds / 60);
  var partInSeconds = seconds % 60;
  partInSeconds = partInSeconds.toString().padStart(2, "0");
  return `${minutes}:${partInSeconds}`;
}

function onEvent() {
  this.initialTime -= 1;
  this.initialTime2 += 1;
  text.setText(formatTime(this.initialTime));
}

function collectStar(player, star) {
  star.disableBody(true, true);
  ccoin.play();
  score += 10;
  scoreTextCurrent.setText("Score: " + score);
  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, "bomb");

    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    bomb.allowGravity = false;
  }
}

function hitBomb(player, bomb) {
  playerLives--;
  livesTextCurrent.setText("Lives: " + playerLives);
  this.sound.play("explosion");
  player.anims.play("turn");
}

function randomXY(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function collectPowerUpTimer(player, powerupvelocity) {
  powerupvelocity.disableBody(true, true);
  this.sound.play("poweruptimersound");
  this.initialTime += 30;
}

function collectPowerUpDeath(player, powerupdeath) {
  powerupdeath.disableBody(true, true);
  this.sound.play("powerupdeathsound");
  playerLives--;
  livesTextCurrent.setText("Lives: " + playerLives);
}

function collectPowerUpImmortality(player, powerupimmortality) {
  powerupimmortality.disableBody(true, true);
  this.sound.play("powerupimmortalitysound");
  playerLives += 1;
  livesTextCurrent.setText("Lives: " + playerLives);
}

function loadPowerUps() {
  var choice = Math.floor(Math.random() * 3 + 1);

  if (choice == 1) {
    powerUpImmortality
      .create(randomXY(0, 800), randomXY(0, 50), "powerupimmortality")
      .setScale(0.2, 0.2);
  } else if (choice == 2) {
    powerUpTimer
      .create(randomXY(0, 800), randomXY(0, 50), "poweruptimer")
      .setScale(0.2, 0.2);
  } else {
    powerUpDeath
      .create(randomXY(0, 800), randomXY(0, 50), "powerupdeath")
      .setScale(0.2, 0.2);
  }
}

export default class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
  }

  preload() {
    this.load.audio("powerupdeathsound", "assets/sounds/powerupdeath.wav");
    this.load.audio("poweruptimersound", "assets/sounds/poweruptimer.wav");
    this.load.audio(
      "powerupimmortalitysound",
      "assets/sounds/powerupimmortality.wav"
    );
    this.load.audio("level1music", "assets/sounds/lvl1.mp3");
    this.load.audio("cjump", "assets/sounds/cjump.mp3");
    this.load.audio("gameOverSound", "assets/sounds/gameover.mp3");
    this.load.audio("bell", "assets/sounds/bell.ogg");
    this.load.audio("explosion", "assets/sounds/explosion.ogg");
    this.load.audio("collectcoin", "assets/sounds/collectcoin.mp3");

    this.load.image("bomb", "assets/images/bomb.png");
    this.load.image("star", "assets/images/star.png");
    this.load.image(
      "powerupimmortality",
      "assets/images/powerup_immortality.png"
    );
    this.load.image("powerupdeath", "assets/images/powerup_death.png");
    this.load.image("poweruptimer", "assets/images/powerup_timer.png");
    this.load.image("flowerbed", "assets/images/butterflyground.png");
    this.load.image("cartoonforest", "assets/images/forestlvl1.png");
    this.load.image("ground", "assets/images/woodenpad.png");
    this.load.image("platform", "assets/images/platform.png");
    this.load.image("gameover", "assets/images/gameoverpixel.png");

    this.load.spritesheet("dronko", "assets/images/dronkoanim1.png", {
      frameWidth: 30,
      frameHeight: 60,
    });

    this.load.plugin(
      "rexvirtualjoystickplugin",
      "rexvirtualjoystickplugin.min.js",
      true
    );
  }

  create() {
    ccoin = this.sound.add("collectcoin");
    cjump = this.sound.add("cjump");
    level1music = this.sound.add("level1music", { volume: 0.25 });
    this.add.image(400, 300, "cartoonforest");
    gameOverSound = this.sound.add("gameOverSound");
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "flowerbed").setScale(2).refreshBody();
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");
    player = this.physics.add.sprite(100, 450, "dronko");
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dronko", { start: 0, end: 3 }),
      frameRate: 10,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dronko", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dronko", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    stars.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    powerUpTimer = this.physics.add.group();
    powerUpDeath = this.physics.add.group();
    powerUpImmortality = this.physics.add.group();
    bombs = this.physics.add.group();

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(powerUpTimer, platforms);
    this.physics.add.collider(powerUpDeath, platforms);
    this.physics.add.collider(powerUpImmortality, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
    this.physics.add.collider(powerUpTimer, powerUpDeath);
    this.physics.add.collider(powerUpTimer, powerUpImmortality);
    this.physics.add.overlap(stars, powerUpDeath);
    this.physics.add.overlap(stars, powerUpTimer);
    this.physics.add.overlap(stars, powerUpImmortality);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.overlap(
      player,
      powerUpTimer,
      collectPowerUpTimer,
      null,
      this
    );
    this.physics.add.overlap(
      player,
      powerUpDeath,
      collectPowerUpDeath,
      null,
      this
    );
    this.physics.add.overlap(
      player,
      powerUpImmortality,
      collectPowerUpImmortality,
      null,
      this
    );
    this.joyStick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 700,
      y: 500,
      radius: 100,
      base: this.add.circle(0, 0, 100, 0x888888, 0.5),
      thumb: this.add.circle(0, 0, 50, 0xcccccc, 0.5),
    });

    gameOverText0 = this.add.text(100, 100, "", {
      fontsize: "86px",
      fill: "#8B0000",
    });
    gameOverText1 = this.add.text(100, 200, "", {
      fontsize: "86px",
      fill: "#8B0000",
    });

    scoreTextCurrent = this.add.text(16, 16, "score:" + score, {
      fontSize: "32px",
      fill: "#FFFFFF",
    });
    livesTextCurrent = this.add.text(16, 48, "Lives:" + playerLives, {
      fontSize: "32px",
      fill: "#FFFFFF",
    });

    console.log("create");

    this.initialTime = 60;
    this.initialTime2 = 0;

    text = this.add.text(340, 50, formatTime(this.initialTime), {
      fontSize: "32px",
      fill: "#FFFFFF",
    });

    timedEvent = this.time.addEvent({
      delay: 1000,
      callback: onEvent,
      callbackScope: this,
      loop: true,
    });
    timedEvent2 = this.time.addEvent({
      delay: randomXY(10000, 15000),
      callback: loadPowerUps,
      callbackScope: this,
      loop: true,
    });

    timerTextCurrent = this.add.text(340, 16, "Time", {
      fontSize: "32px",
      fill: "#FFFF00",
    });
  }

  update() {
    console.log("initial time2 is:" + this.initialTime2);

    if (sceneRestart == 0) {
      this.scene.restart();
      sceneRestart++;
    }
    level1music.play();
    console.log(formatTime(this.initialTime));

    if (playerLives > 0 && this.initialTime > 0) {
      gameOver = false;
    } else {
      score = 0;
      scoreTextCurrent.setText("Score: " + score);
      playerLives = 0;

      gameOver = true;

      gameOverSound.play();
      level1music.stop();

      gameOverText0
        .setText("Game Over")
        .setStyle({
          fontSize: "86px",
          color: "#FFFFFF",
        })
        .setX(100)
        .setY(100);

      gameOverText1
        .setText("Press backspace to restart")
        .setStyle({
          fontSize: "45px",
          color: "#FFFFFF",
        })
        .setX(50)
        .setY(260);

      this.physics.pause();
    }

    if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE)
        .isDown
    ) {
      this.initialTime = 0;
      playerLives = 3;
      this.scene.restart();
    }

    if (cursors.left.isDown || this.joyStick.left) {
      player.setVelocityX(-320);
      player.anims.play("left", true);
    } else if (cursors.right.isDown || this.joyStick.right) {
      player.setVelocityX(320);
      player.anims.play("right", true);
    } else {
      player.setVelocityX(0);
      player.anims.play("turn");
    }

    if ((cursors.up.isDown || this.joyStick.up) && player.body.touching.down) {
      cjump.play();
      player.setVelocityY(-330);
    }
  }
}
