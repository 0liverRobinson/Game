//////////////////////////////////////////////////////////////Initialise -  Game//////////////////////////////////////////////////////////////////
var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");
const START_SCREEN = 0,
  GAME_SCREEN = 1,
  OPTIONS_SCREEN = 2,
  EXTRA_CODE_PROMPT_SCREEN = 3,
  EXTRAS_SCREEN = 4,
  GAME_OVER_SCREEN = 10,
  EASY = 7,
  NORMAL = 5,
  HARD = 3,
  MIDDLE = 1,
  SIDES = 0;
class Star {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = 100 + Math.random() * 45;
    this.length = Math.random() * 45;
  }
}
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velocity = -25;
  }
}
class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.health = 3;
    this.bullets = [];
    this.invinsible = false;
    this.isWorking = true;
    this.mode = 1;
  }
  set(x, y) {
    this.x = x;
    this.y = y;
  }
  addBullet(x, y) {
    var x1, x2, y1, y2;
    switch (this.mode) {
      case SIDES:
        (x1 = x), (x2 = x + imgWidth - 11);
        y1 = y2 = y;
        break;
      case MIDDLE:
        x1 = x2 = x + (imgWidth - 12) / 2;
        y1 = y;
        y2 = y - 50;
        break;
    }
    this.bullets.push(new Bullet(x1, y1));
    this.bullets.push(new Bullet(x2, y2));
  }
  getLazerAt(i) {
    return this.bullets[i];
  }
  breakDown() {
    setTimeout(() => {
      changeScreenFade(GAME_OVER_SCREEN);
    }, 1000);
    this.isWorking = false;
  }
  takeDamage() {
    if (!this.invinsible) {
      ship.health--;
      if (ship.health <= 0) ship.breakDown();
      this.invinsible = true;
      setTimeout(() => {
        ship.invinsible = false;
      }, 1000);
    }
  }
}

class Boulder {
  constructor(x, y, size) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.damage = 5 + Math.random() * 10;
    this.rocks = [];
    this.theta = Math.random();
    this.curve = Math.random() * 50;
    this.velocity = 5 * Math.random();
  }
  breakAway() {
    if (this.size / 10 <= 5) this.destroyed = true;
    else {
      if (this.size / 4 > 10)
        for (var i = 0; i < 2 + Math.random() * 15; i++)
          this.rocks.push(new Boulder(this.x, this.y, this.size / 4));
    }
    this.size = 0;
    this.x = -1;
    this.y = -1;
  }
  move() {
    this.x += (Math.cos(this.theta) * this.curve) / 4;
    this.y += this.velocity;
    this.theta += 0.01;
  }
}

var input = document.getElementsByTagName("input")[0],
  score = 0,
  scoreFontSize = 50,
  ship = new Ship(400, 400),
  size = 70,
  mouseX = 0,
  mouseY = 0,
  mouseDown = false,
  mode = 0,
  pause = false,
  stars = [],
  shipImg = document.getElementsByTagName("img")[0],
  bullets = [],
  boulders = [],
  imgWidth = 72,
  rocketImg = document.getElementsByTagName("img")[1],
  boulderImg = document.getElementsByTagName("img")[2],
  timer = 0,
  loopCount = 0,
  heartSize = 50,
  heartImg = document.getElementsByTagName("img")[3],
  invinsibleHeartImg = document.getElementsByTagName("img")[4],
  temp = new Date(),
  pauseScreenText = [
    "ゲームが一時停止しました",
    "Continue",
    "ゲームを終了します",
  ],
  startScreenText = [
    "オリバーのスペースゲーム",
    "ゲームを始める",
    "ゲームの設定",
    "エクストラ",
  ],
  gameOverTxt = ["ゲームオーバー", "スコア", "", "ゲームを再開する"],
  extraList = ["エクストラ", "無敵", "メニュー"],
  extras = [false, false, false],
  settingScreenText = [
    "ゲームの設定",
    "ハート",
    "" + ship.health,
    "困難",
    "" + NORMAL,
    "メニュー",
  ];

// Cheat Code
const EXTRA_CODE = temp.getDay() * temp.getMonth() + temp.getFullYear();

// Change Events
function toggleEvents(event) {
  // Get keycode

  // On spacebar and in the game, then display the mouse and pause screen
  if (event.keyCode == 27 && mode == GAME_SCREEN)
    document.body.style.cursor = !(pause = !pause) ? "none" : "default";

  // On Space bar, change ship mode to either double cannon or single cannon
  if (event.keyCode == 32) ship.mode = ship.mode == 1 ? 0 : 1;
}

// Adjust the baord when the window resizes
function adjustBoard() {
  // Make Canvas fill entire screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Reset the game
function gameReset() { 
  // Reset health back to the hearts specified in the settings menu (default=3)
  ship.health = parseInt(settingScreenText[2]);
  // Reset the boulders to be 0
  boulders = [];
  // Reset the score and time
  score = 0;
  timer = 0;
  gameOverTxt[2] = "";
}
// Fill board with colour "colour"
function fillBoard(colour) {
  // Create temporary variable of previous colour
  let temp = ctx.fillStyle;
  // Set ctx colour to the arg 'colour'
  ctx.fillStyle = colour;
  // Fill the entire screen with the colour
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Reset the colour
  ctx.fillStyle = temp;
}

// Detect weather your mouse is within a certain amount of bounds on the screen
function isTextSelected(x1, x2, y1, y2) {
  // Check is mouse intersects the specifiied area
  if (mouseX > x1 && mouseX < x2 && mouseY < y1 && mouseY > y2) return true;
  return false;
}

function startScreen() {
 
  // Set font size = 70
  size = 70;
  // Make background Orange
  fillBoard("orange");
 
  // Font colour
  ctx.fillStyle = "white";

  // Get the current centerX of the scren
  let centerX = canvas.width / 2;

  // Display the title text (Olivers space game - translated)
  ctx.fillText(
    startScreenText[0],
    centerX - (startScreenText[0].length * size) / 2,
    100
  );

  // Display the options texts (Settings, Extras)
  for (var i = 1, y = 350; i < startScreenText.length; i++, y += 100) {

    // Make text colour white/ yellow depending on weather we are hovering over the text :
    if (
      isTextSelected(
        centerX - (startScreenText[i].length * size) / 2,
        centerX + (startScreenText[i].length * size) / 2,
        y,
        y - 100
      )
      
    ) {
      // If we are hovering over text set colour to 'yellow'
      ctx.fillStyle = "yellow";
      if (mouseDown) changeScreenFade(i);
    }  // if we are not hovering over the text, make the font colour 'white'
        else ctx.fillStyle = "white";
    
    // Print the text to the centerX of the screen and the correct Y offsets
    ctx.fillText(
      startScreenText[i],
      centerX - (startScreenText[i].length * size) / 2,
      y
    );
  }
  mouseDown = false;
  if (mode == GAME_SCREEN) gameReset();
}

// Display (resume - translated) and (exit - translated) when the user pauses the game
function pauseScreen() {
  // Make font the game themed font
  ctx.font = size + "px 'DotGothic16', sans-serif";
  // Make font colour white
  ctx.fillStyle = "white";
  // Get the centerX of the screen
  let centerX = canvas.width / 2;

  // Display the Pause screen header 
  ctx.fillText(
    pauseScreenText[0],
    centerX - (pauseScreenText[0].length * size) / 2,
    100
  ); // Game paused

  // Display the pause screen options - if hovering over then diplay yellow, else white
  for (var i = 1, y = 350; i < pauseScreenText.length; i++, y += 100) {
    // If hovering over, make text colour yellow
    if (
      isTextSelected(
        centerX - (pauseScreenText[i].length * size) / 2,
        centerX + (pauseScreenText[i].length * size) / 2,
        y,
        y - 100
      )
    ) { 
      ctx.fillStyle = "yellow";
      if (mouseDown) {
        pause = false;
        changeScreenFade(i == 1 ? GAME_SCREEN : START_SCREEN);
      }
      // If we are not hovering over the text, make the text colour white
    } else ctx.fillStyle = "white";

    // Display all the options to the screen with the correct Y offset
    ctx.fillText(
      startScreenText[i],
      centerX - (startScreenText[i].length * size) / 2,
      y
    );
  }
  mouseDown = false;
  if (pause) requestAnimationFrame(pauseScreen);
  else game();
}

function shipCoords(event) {
  // Get mouse coordinates for the ship (mouse)
  mouseX = event.clientX;
  mouseY = event.clientY;
}

// Move stars across screen
function movingStars() {
  // Set Star colour to white
  ctx.fillStyle = "white";
  
  // Display the starts on the screen and move them
  for (var i = 0; i < stars.length; i++) {
    ctx.beginPath();
    // Draw a line from the start of the star to the bottom, using its length
    ctx.moveTo((stars[i].x * canvas.width) / 100, stars[i].y);
    ctx.lineTo((stars[i].x * canvas.width) / 100, stars[i].y + stars[i].length);
    // Move star down the screen
    stars[i].y += stars[i].velocity;
    // If we go past the screen, then reset the Y and X coordinates to random positions on screen below Y 0
    if (stars[i].y > canvas.height) {
      stars[i].y = -Math.random() * 100;
      stars[i].x = Math.random() * 100;
    }
    // Draw item to a screen
    ctx.stroke();
  }
}

let frame = 0,
  xOff = 0;
function animateShip() {
  // Move ship to pointer and animate
  // Set X and Y to mouse coordinates without breaking screen bounds
  ship.set(
    mouseX + imgWidth < window.innerWidth ? mouseX : ship.x,
    mouseY > 0 && mouseY + imgWidth < window.innerHeight ? mouseY : ship.y
  );

  // Get frame and offset
  frame = frame < 3 ? frame + 1 : 0;
  xOff = ship.x - frame * imgWidth;

  // Animate ship:
  ctx.drawImage(shipImg, ship.x - imgWidth * frame, ship.y); // Draw ship sheet
  ctx.clearRect(
    ship.x + imgWidth,
    ship.y,
    ship.x + imgWidth + Math.abs(frame - 3) * imgWidth,
    ship.y + imgWidth
  ); // Clear RHS
  ctx.clearRect(xOff, ship.y, imgWidth * frame, imgWidth); // Clear LHS
}

function laserHitAsteroid(bullet, asteroids) {
  let returnValue = false;
  for (var i = 0; i < asteroids.length; i++) {

    // If it hits then braek asteroid and add score
    if (
      bullet.y < asteroids[i].y + asteroids[i].size &&
      bullet.y > asteroids[i].y &&
      bullet.x < asteroids[i].x + asteroids[i].size &&
      bullet.x > asteroids[i].x
    ) {
      score += Math.round(asteroids[i].size);
      asteroids[i].breakAway();

      return true;
    }
    // If asteroid has rocks recurse through to check if they have been hit
    if (asteroids[i].rocks.length > 0 && !returnValue)
      returnValue = laserHitAsteroid(bullet, asteroids[i].rocks);
  }
  return returnValue;
}
function animateBullets() {
  for (var i = 0; i < ship.bullets.length; i++) {
    // Move lasers
    ship.bullets[i].y += ship.bullets[i].velocity;
    ctx.drawImage(rocketImg, ship.bullets[i].x, ship.bullets[i].y);
    // Remove the lasers that has crossed the screen
    if (laserHitAsteroid(ship.bullets[i], boulders)) {
      ship.bullets[i].x = -1;
      ship.bullets[i].y = -1;
      ship.bullets.splice(i, 1);
      continue;
    }
    // Remove laser once off screen
    if (ship.getLazerAt(i).y < 0) {
      ship.bullets.reverse();
      ship.bullets.pop();
      ship.bullets.reverse();
    }
  }
}

// Move asteroid across the screen
function movingAsteroid(boulder) {

  for (var i = 0; i < boulder.length; i++) {
    // Move the asteroid
    boulder[i].move();
    // Display the asteroid
    ctx.drawImage(
      boulderImg,
      boulder[i].x,
      boulder[i].y,
      boulder[i].size,
      boulder[i].size
    );
    // If it hits ship then take damage
    if (
      ship.x + imgWidth >= boulder[i].x &&
      ship.y + imgWidth >= boulder[i].y &&
      ship.x <= boulder[i].x + boulder[i].size &&
      ship.y <= boulder[i].y + boulder[i].size
    ) {
        // If taken damage and not in a short invinsability frame, then break asteroid
      if (!ship.invinsible) boulder[i].breakAway();
      // If we are not using the invinsibility cheat, then take a heart off
      if (!extras[1]) ship.takeDamage();
    }
    // If we still have boulders left after the loop, then continue moving them
    if (boulder[i].rocks.length > 0) movingAsteroid(boulder[i].rocks);
  }
}

// Display the players GUI
function displayInfo() {
  // Set the text margin to 10
  let margin = 10;
  // Set font to gaming font
  ctx.font = scoreFontSize + "px 'DotGothic16', sans-serif";
  // Set font colour to white
  ctx.fillStyle = "white";
  // Display all our hearts to the screen at the top right
  for (var i = 0; i < ship.health; i++)
    ctx.drawImage(
      !extras[1] ? heartImg : invinsibleHeartImg,
      window.innerWidth - i * 1.1 * heartSize - (heartSize + margin),
      heartSize,
      heartSize,
      heartSize
    );
  // Display our score at the top right of the screen above hearts
  ctx.fillText(
    score.toString(),
    window.innerWidth - (score.toString().length * scoreFontSize) / 2 - margin,
    scoreFontSize
  );
}

function playGame() {
  // Fill background as black
  fillBoard("black");
  // Animate our ship
  animateShip();
  // Move the stars across the screen
  movingStars();
  // Move the asteroids on teh screen
  movingAsteroid(boulders);
  // Display the player GUI
  displayInfo();
  // Keep record of amount of loops
  loopCount++;
  // Every 100 loops, increase timer by 1
  if (loopCount % 100 == 0) timer += 1;
  // Every 1000 loops, increase health by 1 (if not using extra )
  if (loopCount % 1000 == 0 && !extras[1]) ship.health++;
  // Add new asteroids at rate according to difficulty (settings[2])
  if (timer % parseInt(settingScreenText[4]) == 0) {
    for (var i = 0; i < timer / parseInt(settingScreenText[4]); i++)
      // Add more asteroids
      boulders.push(
        new Boulder(Math.random() * canvas.width, 0, 50 + Math.random() * 100)
      );
    // Increase the player score and timer
    score += (timer++ * 100) / parseInt(settingScreenText[4]);
  }
  // If we are clicking then shoot bullets
  if (mouseDown) {
    ship.addBullet(ship.x, ship.y);
    mouseDown = false;
  }
  // If we still have bullets shot, then move them across the screen.
  if (ship.bullets.length > 0) animateBullets(ship);
}

// Display game over screen
function gameOver() {
  // Make background colour orange
  fillBoard("orange");
  // Make font colour white
  ctx.fillStyle = "white";
  // Make font size 70
  size = 70;
  // Set font family
  ctx.font = size + "px 'DotGothic16', sans-serif";
  // Get center X of screen
  let centerX = canvas.width / 2;
  // Display the GAME OVER titles
  ctx.fillText(
    gameOverTxt[0],
    canvas.width / 2 - (gameOverTxt[0].length * size) / 2,
    100
  );
  // Display Score text
  ctx.fillText(
    gameOverTxt[1],
    centerX - (gameOverTxt[1].length * size) / 2,
    350
  );
  // Dsiplay score
  ctx.fillText(
    gameOverTxt[2],
    centerX - (gameOverTxt[2].length * size) / 4,
    450
  );
  // If hovering over 'restart', change font to yello, then change screen to start screen
  if (
    isTextSelected(
      centerX - (gameOverTxt[3].length * size) / 2,
      centerX + (gameOverTxt[3].length * size) / 2,
      550,
      450
    )
  ) {
    ctx.fillStyle = "yellow";
    if (mouseDown) changeScreenFade(START_SCREEN);
  }

  // Display game restart
  ctx.fillText(
    gameOverTxt[3],
    centerX - (gameOverTxt[3].length * size) / 2,
    550
  );

  mouseDown = false;
}

function optionsScreen() {
  // Font size 
  size = 70;
  // Fille background orange
  fillBoard("orange");
  // make font colour white
  ctx.fillStyle = "white";
  // Find center of canvas X
  let centerX = canvas.width / 2;
  // Display the settings screen TITLE
  ctx.fillText(
    settingScreenText[0],
    centerX - (settingScreenText[0].length * size) / 2,
    100
  );
  // Display the settings screen options
  for (var i = 1, y = 250; i < settingScreenText.length; i++, y += 100) {
    // If an option, then make it highlitable and clickable and change colour on hover
    if (i % 2 != 0) {
      if (
        isTextSelected(
          centerX - (settingScreenText[i].length * size) / 2,
          centerX + (settingScreenText[i].length * size) / 2,
          y,
          y - 100
        )
      ) {
        ctx.fillStyle = "yellow";
        if (mouseDown)
          // If clicking on option, change theie value below:
          switch (i) {
            case 1:
                // Increase heart count cap at 3 <= x <= 10
              settingScreenText[i + 1] =
                "" +
                (parseInt(settingScreenText[i + 1]) + 1 <= 10
                  ? parseInt(settingScreenText[i + 1]) + 1
                  : 3);
              mouseDown = false;
              break;
            case 3:
                // Change difficulty of the game
              settingScreenText[i + 1] =
                "" +
                (parseInt(settingScreenText[i + 1]) - 2 >= 2
                  ? parseInt(settingScreenText[i + 1]) - 2
                  : 7);
              mouseDown = false;
              break;
            case 5:
                // Return back to start screen
              changeScreenFade(START_SCREEN);
              break;
          }
      }
      // If not hovering, keep text white
    } else ctx.fillStyle = "white";
    // Create proper centering
    if (i != 4)
      ctx.fillText(
        settingScreenText[i],
        centerX - (settingScreenText[i].length * size) / 2,
        y
      );
    else {
        // Set the difficulty settings text appropriate to the option selected
      let txt;
      switch (parseInt(settingScreenText[4])) {
        case EASY:
          txt = "易い";
          break;
        case NORMAL:
          txt = "正常";
          break;
        case HARD:
          txt = "難しい";
          break;
      }
      // Center the difficulty text
      ctx.fillText(txt, centerX - (txt.length * size) / 2, y);
    }
  }
}

// The extra code screen (cheat screen)
function extraCodeScreen() {
  // Fill background orange
  fillBoard("orange");
  // Make font gaming font
  ctx.font = size + "px 'DotGothic16', sans-serif";
  // Make font colour white
  ctx.fillStyle = "white";
  // Center text on screen
  let centerX = canvas.width / 2;
  // Display extras screen title
  ctx.fillText(extraList[0], centerX - (extraList[0].length * size) / 2, 100);
  
  // Display all the extras options
  for (var i = 1, y = 350; i < extraList.length - 1; i++, y += 100) {
    if (
        // If hovering, change colour to yellow
      isTextSelected(
        centerX - (extraList[i].length * size) / 2,
        centerX + (extraList[i].length * size) / 2,
        y,
        y - 100
      )
    ) {
      ctx.fillStyle = "yellow";
      if (mouseDown) {
        // Toggle extras
        extras[i] = !extras[i];
      }
      // If not hovering, then keep colour white
    } else if (!extras[i]) ctx.fillStyle = "white";
    // Else make colour yellow (show toggle is true)
    else ctx.fillStyle = "yellow";
    // Display text on screen
    ctx.fillText(extraList[i], centerX - (extraList[i].length * size) / 2, y);
  }

  // Set font colour white
  ctx.fillStyle = "white";
  // If selecting 'menu' then change hihglight colour to yellow
  if (
    isTextSelected(
      centerX - (extraList[extraList.length - 1].length * size) / 2,
      centerX + (extraList[extraList.length - 1].length * size) / 2,
      550,
      450
    )
  ) {
    ctx.fillStyle = "yellow";
    // Return home
    if (mouseDown) changeScreenFade(START_SCREEN);
  }

  // Display the "menu" button to the screen
  ctx.fillText(
    extraList[extraList.length - 1],
    centerX - (extraList[extraList.length - 1].length * size) / 2,
    550
  );

  mouseDown = false;
}


ctx.globalAlpha = 1.0;
var opacity = 0.1;
function changeScreenFade(newMode) {
    // Set mouse to either visable or non visable depending on what screen we are transfering to
  document.body.style.cursor = newMode == GAME_SCREEN ? "none" : "default";
  // If we are either entering or exiting the game, then make the fade transition
  if (
    mode == GAME_SCREEN &&
    (newMode == START_SCREEN || newMode == GAME_OVER_SCREEN)
  ) {
    // Fade in and out
    let nm = newMode;
    let opacity = 0.0;
    ctx.globalAlpha = 0.0;
    for (var i = 0; i < 20; i++) {
      // Fade transition between screens
      setTimeout(() => {
        opacity += 0.1;
        ctx.globalAlpha = Math.abs(1 - opacity);
        // When we reach roughly half the transition, then make the change of screen
        if (opacity > 0.9) {
          mode = nm;
          ctx.font = size + "px 'DotGothic16', sans-serif";
          ctx.strokeStyle = "white";
          document.body.style.cursor = "default";
        }
      }, 150 * i);
    }
    // If we are not exiting or entering the game then jump back to the previous screen
  } else mode = newMode;
}

// When clicking extras, prompt user to enter extra passcode
function extraCodePrompt() {
  let n = prompt("コードを入力します。");
  if (n == null || n == EXTRA_CODE) mode = (n == EXTRA_CODE) * 4;
}
// Set default mode to start screen
mode = START_SCREEN;

function game() {
  switch (mode) {
    case START_SCREEN:
      startScreen();
      break;

    case GAME_SCREEN:
      playGame();
      break;

    case OPTIONS_SCREEN:
      fillBoard("orange");
      optionsScreen();
      break;

    case EXTRA_CODE_PROMPT_SCREEN:
      extraCodePrompt();
      break;

    case EXTRAS_SCREEN:
      extraCodeScreen();
      break;

    case GAME_OVER_SCREEN:
        // If the ship is not working, then set it 'working again'
      if (!ship.isWorking) {
        gameOverTxt[2] = "" + score;
        ship.isWorking = true;
      }
      // Display game over screen
      gameOver();
      break;

    default:
      gameOver();
      break;
  }
  // IF we are not paused, display as usual
  if (!pause) requestAnimationFrame(game);
  else {
    // Else, display pause screen
    document.body.style.cursor = "default";
    requestAnimationFrame(pauseScreen);
  }
}
////////////////////////////////////////////////////////////// Init  //////////////////////////////////////////////////////////////////
requestAnimationFrame(game);

// initialise the stars array:
for (
  var i = 0;
  i < 15;
  i++ // Initialise stars
)
  stars.push(new Star(Math.random() * 100, 0));

// Initialise the asteroids array 
for (
  var i = 0;
  i < 5;
  i++ // Initialise Asteroids
)
  boulders.push(
    new Boulder(Math.random() * canvas.width, 0, 50 + Math.random() * 100)
  );
// Adjust the bord initially 
adjustBoard();

// Configure the canvase on the screen to fully fill the screen 
canvas.style.position = "absolute";
canvas.style.left = canvas.style.top = "0px";

// Hide any scroll bars
document.body.style.overflow = "hidden";

// Display start screen
startScreen();

// Set font to gaming font
ctx.font = size + "px 'DotGothic16', sans-serif";
// Set font colour to white
ctx.strokeStyle = "white";

// Set (non canvas) background to black
document.body.style.background = "black";

// Create event listener (resize) to adjust the canvas to fill the screen
window.addEventListener("resize", () => {
  // Adjust the board to fill screen
  adjustBoard();
  // Set font colour white
  ctx.strokeStyle = "white";
  // Set font family
  ctx.font = size + "px 'DotGothic16', sans-serif";
});

// On mouse down set mousedown true
window.addEventListener("mousedown", () =>  mouseDown = true );

// On mouseup set mousedown false
window.addEventListener("mouseup", () => mouseDown = false );