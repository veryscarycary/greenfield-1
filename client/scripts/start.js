(function() { 
  var game = new Phaser.Game(800, 600, Phaser.AUTO, "game");
  game.state.add("stage1", App.stage1);

  game.state.add("stage2", App.stage2);

  game.state.start("stage1");

})();