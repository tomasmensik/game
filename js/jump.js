const SPRITE_SIZE = 16;
let ctx = document.querySelector("canvas").getContext("2d");
let scoreText = document.getElementById("score");

ctx.canvas.height = 180;
ctx.canvas.width = 320;

let Animation = function(frame_set, delay) {

    this.count = 0;// počítá cykly od doby, kdy se změnil poslední frame
    this.delay = delay;// počet cyklů, než se může změnit další
    this.frame = 0;//hodnota v poli, kde jsou animace(pole animací)
    this.frame_index = 0;// současný index v současném poli animací
    this.frame_set = frame_set;// současný set animací(jsou 3 pole)

  }

Animation.prototype = {

//Mění to aktuální set, pokud je například 1.pole, dá se 2., etc.
    change:function(frame_set, delay = 15) {

      if (this.frame_set != frame_set) {// pokud je frame set jiný, tak..

        this.count = 0;// Resetuje se počítání
        this.delay = delay;// Nastaví se delay
        this.frame_index = 0;// Začne na novém indexu (snímku)
        this.frame_set = frame_set;// Nastaví nové pole
        this.frame = this.frame_set[this.frame_index];// Nastaví index v novém poli

      }

    },

// Volá po každém cyklu
    update:function() {

      this.count ++;// Měří, kolik cyklů už bylo

      if (this.count >= this.delay) {//Pokud už bylo dostatek snímků, změní se frame

        this.count = 0;// Resetuje se count
        /* Jestli je index na poslední hodnotě, tak se to dá na 0*/
        //Jestli není index na poslední hodntoě, tak se to dá na 1
        this.frame_index = (this.frame_index == this.frame_set.length - 1) ? 0 : this.frame_index + 1;
        this.frame = this.frame_set[this.frame_index];// Změní aktuální index

      }

    }

};
//Pole, které má 3 sety - každé pole má jiné obrázky
let sprite_sheet = {
    frame_sets: [[0, 1], [2, 3], [4, 5]],
    image: new Image()
}

let player = {
//Animace chůze hráče
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
//Pokud zmačknu šipku dolů, tak mi to dá "true" a potom, když zmačknu například left key, tak budu moct chodit s šipkou dolů a zároveň s šipkou doleva
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
//Třída pro Coins
class Coins {

  constructor(x, y, speed = 4) {
      this.x = randomCislo(0,320);
      this.y = -10;
      this.img = new Image();
      this.img.src = 'img/coin.gif';
  }
  //postupné zrychlování
  move() {
      this.y += 2;
  }
//pomoci funkce to dá random hodnotu na osu x v rozmezí 10-290 a osa y je -10
  obnov() {
      this.x = randomCislo(10,290);
      this.y = -10;
  }
//vykreslí coin
  draw() {
      ctx.drawImage(this.img, this.x, this.y);
  }
}

function pohyb(){
  if (player.jumping==true){
    obj.obnov();
  }
}

//objekt game
let game = {
  coins: [],
  score: 0,
//vymaluje se character a následuje vykreslení coinů
  paint: function () {
      ctx.clearRect(0,0,340,340);
      ctx.drawImage(sprite_sheet.image, player.animation.frame * SPRITE_SIZE, 0, SPRITE_SIZE, SPRITE_SIZE, Math.floor(player.x), Math.floor(player.y), SPRITE_SIZE, SPRITE_SIZE);
      player.animation.update();
      window.requestAnimationFrame(loop);
      this.coins.forEach(function (obj) {
          obj.move();
          obj.draw();
          //pokud hráč coinu chytí, přičte se mu 1 point
              if (player.y <= obj.y) {
                this.score++;
                scoreText.innerHTML = `Skóre: ${this.score}`;
                  obj.obnov();
              }
              //pokud hráč coinu nechytí, ubere se mu 1 point
              else if (obj.y >= 180-22) {
              this.score--; 
              scoreText.innerHTML = `Skóre: ${this.score}`;
              obj.obnov();
              }
      })
  }
}

let loop = function() {
//jestli je hráč ve vzduchu, přidá se mu gravitace ke spadnutí + nemůže skákat
  if (control.up && player.jumping == false) {

    player.y_velocity -= 15;
    player.jumping = true;

  }
//pokud jde doleva, dá se mu animace + se zrychlí
  if (control.left) {

    player.animation.change(sprite_sheet.frame_sets[2],15);
    player.x_velocity -= 0.5;

  }
//pokud jde doprava, dá se mu animace + se zrychlí
  if (control.right) {

    player.animation.change(sprite_sheet.frame_sets[1],15);
    player.x_velocity += 0.5;

  }
//pokud stojí na místě, dá se mu animace
  if (control.right == false && control.left == false){

    player.animation.change(sprite_sheet.frame_sets[0],20);
  }


  player.y_velocity += 1;// gravity
  player.x += player.x_velocity;
  player.y += player.y_velocity;
  player.x_velocity *= 0.9;// friction
  player.y_velocity *= 0.9;// friction

  // jestli hráč spadne pod tuhle úroven, tka se teleportuje zpátky
  if (player.y > 180 - 16) {

    player.jumping = false;
    player.y = 180 - 16;
    player.y_velocity = 0;

  }

  // pokud hráč projde přes tuhle hodnotu x, tak se teleportuje na druhou stranu x
  if (player.x < -32) {

    player.x = 320;

  } else if (player.x > 320) {//to samé akorát druhá strana

    player.x = -32;

  }

};

sprite_sheet.image.src = "img/animation.png";
window.addEventListener("keydown", control.keyListener)
window.addEventListener("keyup", control.keyListener);
window.requestAnimationFrame(loop);
animate();
game.coins.push(new Coins());