(function() { 
  var game = new Phaser.Game(800, 600, Phaser.AUTO, "game");
  game.state.add("stage1", stage1);
  game.state.add("stage2", stage2);
  game.state.start("stage1");
})();