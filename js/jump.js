const SPRITE_SIZE = 16;
let ctx = document.querySelector("canvas").getContext("2d");
let scoreText = document.getElementById("score");

ctx.canvas.height = 180;
ctx.canvas.width = 320;

let Animation = function(frame_set, delay) {

    this.count = 0;// Counts the number of game cycles since the last frame change.
    this.delay = delay;// The number of game cycles to wait until the next frame change.
    this.frame = 0;// The value in the sprite sheet of the sprite image / tile to display.
    this.frame_index = 0;// The frame's index in the current animation frame set.
    this.frame_set = frame_set;// The current animation frame set that holds sprite tile values.

  }

Animation.prototype = {

    /* This changes the current animation frame set. For example, if the current
    set is [0, 1], and the new set is [2, 3], it changes the set to [2, 3]. It also
    sets the delay. */
    change:function(frame_set, delay = 15) {

      if (this.frame_set != frame_set) {// If the frame set is different:

        this.count = 0;// Reset the count.
        this.delay = delay;// Set the delay.
        this.frame_index = 0;// Start at the first frame in the new frame set.
        this.frame_set = frame_set;// Set the new frame set.
        this.frame = this.frame_set[this.frame_index];// Set the new frame value.

      }

    },

    /* Call this on each game cycle. */
    update:function() {

      this.count ++;// Keep track of how many cycles have passed since the last frame change.

      if (this.count >= this.delay) {// If enough cycles have passed, we change the frame.

        this.count = 0;// Reset the count.
        /* If the frame index is on the last value in the frame set, reset to 0.
        If the frame index is not on the last value, just add 1 to it. */
        this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
        this.frame = this.frame_set[this.frame_index];// Change the current frame value.

      }

    }

};

let sprite_sheet = {
    frame_sets: [[0, 1], [2, 3], [4, 5]],
    image: new Image()
}

let player = {

    animation: new Animation(),
    height:16,
    width:16,
    x:ctx.canvas.width/2, 
    x_velocity:0,
    y:0,
    y_velocity:0,
    jumping:true
  
};

let control = {

  left:false,
  right:false,
  up:false,
  keyListener:function(event) {

    let key_state = (event.type == "keydown")?true:false;

    switch(event.keyCode) {

      case 37:// left key
        control.left = key_state;
      break;
      case 38:// up key
        control.up = key_state;
      break;
      case 39:// right key
        control.right = key_state;
      break;

    }

  }

};

function animate() {
  requestAnimationFrame(animate);
  game.paint();
}

function randomCislo(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Coins {

  constructor(x, y, speed = 4) {
      this.x = randomCislo(0,320);
      this.y = -10;
      this.img = new Image();
      this.img.src = 'img/coin.gif';
  }
  move() {
      this.y += 2;
  }

  obnov() {
      this.x = randomCislo(10,290);
      this.y = -10;
  }

  draw() {
      ctx.drawImage(this.img, this.x, this.y);
  }
}

function pohyb(){
  if (player.jumping==true){
    obj.obnov();
  }
}


let game = {
  coins: [],
  score: 0,

  paint: function () {
      ctx.clearRect(0,0,340,340);
      ctx.drawImage(sprite_sheet.image, player.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(player.x), Math.floor(player.y), SPRITE_SIZE, SPRITE_SIZE);
      player.animation.update();
      window.requestAnimationFrame(loop);
      this.coins.forEach(function (obj) {
          obj.move();
          obj.draw();
              if (player.y <= obj.y) {
                this.score++;
                scoreText.innerHTML = `Skóre: ${this.score}`
                  obj.obnov();
              }
              else if (obj.y >= 180-22) {
              this.score--; 
              scoreText.innerHTML = `Skóre: ${this.score}`
              obj.obnov();
              }
      })
  }
}

let loop = function() {

  if (control.up && player.jumping == false) {

    player.y_velocity -= 15;
    player.jumping = true;

  }

  if (control.left) {

    player.animation.change(sprite_sheet.frame_sets[2],15);
    player.x_velocity -= 0.5;

  }

  if (control.right) {

    player.animation.change(sprite_sheet.frame_sets[1],15);
    player.x_velocity += 0.5;

  }

  if (control.right == false && control.left == false){

    player.animation.change(sprite_sheet.frame_sets[0],20);
  }


  player.y_velocity += 1;// gravity
  player.x += player.x_velocity;
  player.y += player.y_velocity;
  player.x_velocity *= 0.9;// friction
  player.y_velocity *= 0.9;// friction

  // if player is falling below floor line
  if (player.y > 180 - 16) {

    player.jumping = false;
    player.y = 180 - 16;
    player.y_velocity = 0;

  }

  // if player is going off the left of the screen
  if (player.x < -32) {

    player.x = 320;

  } else if (player.x > 320) {// if player goes past right boundary

    player.x = -32;

  }

};

sprite_sheet.image.src = "img/animation.png";// Start loading the image.
window.addEventListener("keydown", control.keyListener)
window.addEventListener("keyup", control.keyListener);
window.requestAnimationFrame(loop);
animate();
game.coins.push(new Coins());