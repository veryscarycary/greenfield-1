var App = {};

// START SCREEN

App.stage0 = function (game) {
  console.log('starting stage0');
  console.log(game);
  App.info.game = game;
};

App.stage0.prototype = {
  preload: function () {
    this.load.bitmapFont('pixel', '/../assets/font.png', '/../assets/font.fnt');
    this.load.image('background', '/../../../assets/space.png');

    // Load the button image, replace 'button.png' with your image's path
    this.load.image('buttonUp', '/../../../assets/start_button_up.png');
    this.load.image('buttonDown', '/../../../assets/start_button_down.png');
  },

  create: function () {
    function onButtonClick() {
      this.state.start('stage1');
    }
    console.log('STAGE 0 CREATE');

    this.add.tileSprite(0, 0, 800, 600, 'background');

    // Create the button with two images: up and down
    var button = this.add.button(
      this.world.centerX, // x position (centered)
      this.world.centerY, // y position (centered)
      'buttonUp', // initial button image (unpushed)
      onButtonClick, // function to call on click
      this, // context
      0,
      0,
      0 // Down frame (when the button is pressed)
    );

    // Center the button anchor
    button.anchor.setTo(0.5, 0.5);

    // Scale the button (e.g., to 0.3 times its original size)
    button.scale.setTo(0.3, 0.3); // Change to your desired scaling factor

    // Change to 'buttonDown' image when the button is pressed
    button.onInputDown.add(function () {
      button.loadTexture('buttonDown');
    }, this);

    // Revert to 'buttonUp' image when the button is released
    button.onInputUp.add(function () {
      button.loadTexture('buttonUp');
    }, this);

    // // Create the button
    // var button = this.add.button(this.world.centerX, this.world.centerY, 'button', onButtonClick, this);

    // // Center the button anchor
    // button.anchor.setTo(0.5, 0.5);

    // //adds text to screen
    // this.createLobbyText();
  },

  update: function () {
    console.log('update is running');
  },

  // Stage1 Utils

  createLobbyText: function () {
    var text =
      'Waiting for new players!\nWhen all players are present,\n grab the coin to start!';
    this.coolText = this.add.bitmapText(
      this.world.centerX - 300,
      120,
      'pixel',
      text,
      30
    );
    this.coolText.align = 'center';
    this.coolText.tint = 0xff00ff;
  },
};
