import Introtext from "./Introtext.js";
import Boot from "./Boot.js";
import Level1 from "./Level1.js";

var config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },

  scene: [Boot, Introtext, Level1],
};

var game = new Phaser.Game(config);
window.game = game;

export default game;
