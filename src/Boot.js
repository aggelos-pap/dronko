var intromusic;
var lastTime = 0;

export default class Boot extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "rexvirtualjoystickplugin.min.js",
      true
    );
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px Arial",
        fill: "#9c2727",
      },
    });
    loadingText.setOrigin(0.5, 0.5);
    this.load.image("logo", "assets/images/logo.png");
    for (var i = 0; i < 250; i++) {
      this.load.image("logo" + i, "assets/images/logo.png");
    }
    this.load.on("progress", function (value) {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on("fileprogress", function (file) {});
    this.load.on("complete", function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    this.load.audio("intromusic", "assets/sounds/entrysound.mp3");
    this.load.image("clicktoplay", "assets/images/clicktoplay.png");
  }

  create() {
    var cursors = this.input.keyboard.createCursorKeys();
    var logo = this.add.image(400, 300, "logo");

    this.game.input.addPointer();
    intromusic = this.sound.add("intromusic");

    this.joyStick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 700,
      y: 500,
      radius: 100,
      base: this.add.circle(0, 0, 100, 0x888888, 0.5),
      thumb: this.add.circle(0, 0, 50, 0xcccccc, 0.5),
      depth: 0,
    });
  }

  update() {
    if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).isDown ||
      this.joyStick.up
    ) {
      intromusic.play();
      this.scene.start("Introtext");
    }
  }
}
