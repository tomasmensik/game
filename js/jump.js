let ctx = document.querySelector("canvas").getContext("2d");
let playerImg = new Image();
playerImg.src = 'img/img_running.png'

ctx.canvas.height = 180;
ctx.canvas.width = 320;

let player = {

  height:10,
  width:10,
  x:144, // center of the canvas
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

    var key_state = (event.type == "keydown")?true:false;

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

let loop = function() {

  if (control.up && player.jumping == false) {

    player.y_velocity -= 15;
    player.jumping = true;

  }

  if (control.left) {

    player.x_velocity -= 0.5;

  }

  if (control.right) {

    player.x_velocity += 0.5;

  }

  player.y_velocity += 1;// gravity
  player.x += player.x_velocity;
  player.y += player.y_velocity;
  player.x_velocity *= 0.9;// friction
  player.y_velocity *= 0.9;// friction

  // if player is falling below floor line
  if (player.y > 180 - 10) {

    player.jumping = false;
    player.y = 180 - 10;
    player.y_velocity = 0;

  }

  // if player is going off the left of the screen
  if (player.x < -32) {

    player.x = 320;

  } else if (player.x > 320) {// if player goes past right boundary

    player.x = -32;

  }


  ctx.clearRect(player.x, player.y, player.width+10, player.height+10);
  ctx.clearRect(player.x+10, player.y+10, player.width+700, player.height+700);
  ctx.clearRect(player.x-10, player.y-10, player.width+700, player.height+700);
  ctx.fillStyle = "#ff0000";// hex for red
  ctx.beginPath();
  ctx.drawImage(playerImg, 0, 0, 160, 160)
  ctx.rect(player.x, player.y, player.width, player.height);
  ctx.fill();

  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);

};

window.addEventListener("keydown", control.keyListener)
window.addEventListener("keyup", control.keyListener);
window.requestAnimationFrame(loop);