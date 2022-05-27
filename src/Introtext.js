// var introMusic;

// export default class Introtext extends Phaser.Scene
// {
//     constructor ()
//     {
//         super('Introtext');

//     }

//     preload()
//     {
//         this.load.image('dronkostory', 'assets/images/dronkostory.png');
//         this.load.audio('introMusic', 'assets/sounds/entrysound.mp3');

//     }

//      create()
//      {
//         var dronkostory = this.add.image(400, 300, 'dronkostory');
//         introMusic = this.sound.add('introMusic');

//      }

//      update(){
//         if (this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).isDown) {
//              introMusic.play();
//             this.scene.start('Level1');

//         }

//     }
//     }

var introMusic;
var largeText = null;
var bunny = null;
var vx = 4;
var vy = 4;

export default class Introtext extends Phaser.Scene {
  constructor() {
    super("Introtext");
  }

  preload() {
    this.load.plugin(
      "rexvirtualjoystickplugin",
      "rexvirtualjoystickplugin.min.js",
      true
    );
    this.load.bitmapFont(
      "greek",
      "assets/fonts/bitmap/greek_0.png",
      "assets/fonts/bitmap/greek.xml"
    );
    this.load.text("dronkostory", "assets/text/dronkostory.txt");
    this.load.audio("introMusic", "assets/sounds/entrysound.mp3");
  }

  create() {
    this.joyStick = this.plugins.get("rexvirtualjoystickplugin").add(this, {
      x: 700,
      y: 500,
      radius: 100,
      base: this.add.circle(0, 0, 100, 0x888888, 0.5),
      thumb: this.add.circle(0, 0, 50, 0xcccccc, 0.5),
      depth: 0,
    });
    introMusic = this.sound.add("introMusic");
    largeText = this.add.bitmapText(
      120,
      450,
      "greek",
      game.cache.text.get("dronkostory")
    );
  }

  update() {
    largeText.setTint(0xffffff);
    largeText.y -= 0.25;
    if (
      this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).isDown ||
      this.joyStick.up
    ) {
      introMusic.play();
      this.scene.start("Level1");
    }
  }
}
