//////////////////////////////////////////////////////////////Initialise -  Game//////////////////////////////////////////////////////////////////
var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext("2d");
const START_SCREEN = 0, GAME_SCREEN = 1, OPTIONS_SCREEN = 2, EXTRA_CODE_PROMPT_SCREEN=3, EXTRAS_SCREEN=4, GAME_OVER_SCREEN = 10, EASY = 7, NORMAL = 5, HARD = 3, MIDDLE = 1, SIDES = 0;
class Star
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.velocity =  100 + Math.random() * 45;
        this.length = Math.random() * 45;
    }    
};
class Bullet
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.velocity = -25;
    }
};
class Ship
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.health = 3;
        this.bullets = [];
        this.invinsible = false;
        this.isWorking=true;
        this.mode = 1;
    }
    set(x,y)
    {
        this.x = x;
        this.y = y;
    }
    addBullet(x,y)
    {
        var x1, x2, y1, y2;
        switch(this.mode)
        {
            case SIDES:
                x1 = x, x2 = x + imgWidth - 11;
                y1 = y2 = y;
            break;
            case MIDDLE:
                x1 = x2 = x + (imgWidth - 12)/2;
                y1 = y;
                y2 = y - 50;
            break;
        }
        this.bullets.push(new Bullet(x1,y1));
        this.bullets.push(new Bullet(x2,y2));
    }
    getLazerAt(i)
    {
        return this.bullets[i];
    }
    breakDown()
    {
        setTimeout(()=> {
            changeScreenFade(GAME_OVER_SCREEN);
        }, 1000);
        this.isWorking=false;
    }
    takeDamage()
    {
        if (!this.invinsible) {
        ship.health--;
        if (ship.health <= 0 )
            ship.breakDown();
        this.invinsible = true;
            setTimeout(() => {
                ship.invinsible = false;
            }, 1000);
        }
    }
};

class Boulder 
{
    constructor(x,y,size)
    {
        this.size = size;
        this.x = x;
        this.y = y;
        this.damage = 5 + Math.random() * 10;
        this.rocks = [];
        this.theta = Math.random();
        this.curve = Math.random() * 50;
        this.velocity =  5 * Math.random();
    }
    breakAway()
    {
        if (this.size/10 <= 5)
            this.destroyed = true;
        else
        {
            if (this.size /4 > 10)
            for (var i = 0; i < (2 + Math.random() * 15); i++)
                this.rocks.push(new Boulder(this.x,this.y, this.size/4));
        }
        this.size =0;
        this.x = -1;
        this. y = -1;
    }
    move()
    {
        this.x += (Math.cos(this.theta) * this.curve)/4;
        this.y += this.velocity;
        this.theta += 0.01;
    }
};

var input = document.getElementsByTagName('input')[0], score=0, scoreFontSize = 50, ship = new Ship(400,400), size = 70, mouseX = 0, mouseY = 0,  mouseDown = false, mode = 0, pause = false, stars = [], shipImg = document.getElementsByTagName("img")[0], bullets=[], boulders=[], imgWidth = 72, 
rocketImg = document.getElementsByTagName("img")[1], boulderImg = document.getElementsByTagName("img")[2], timer = 0, loopCount = 0, heartSize = 50, heartImg = document.getElementsByTagName("img")[3], invinsibleHeartImg = document.getElementsByTagName("img")[4], 
temp = new Date(), pauseScreenText = ["ゲームが一時停止しました", "Continue", "ゲームを終了します"] , startScreenText = ["オリバーのスペースゲーム", "ゲームを始める", "ゲームの設定", "エクストラ"], gameOverTxt = ["ゲームオーバー", "スコア", "", "ゲームを再開する"], extraList = ["エクストラ", "無敵", "メニュー"], extras = [false, false, false], settingScreenText = ["ゲームの設定", "ハート", ""+ship.health, "困難", ""+NORMAL,"メニュー"];

const EXTRA_CODE= temp.getDay() * temp.getMonth() + temp.getFullYear();
function toggleEvents(event)               // Get keycode
{
    if (event.keyCode == 27 && mode == GAME_SCREEN)           
        document.body.style.cursor= (! (pause = !pause) )?"none":"default";
    if (event.keyCode == 32)
        ship.mode = (ship.mode == 1)?0:1; 
}
function adjustBoard()                      // Adjust board to fit window
{
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;
}
function gameReset()
{
    ship.health = parseInt(settingScreenText[2]);
    boulders = [];
    score = 0;
    timer = 0;
    gameOverTxt[2] = "";
}
function fillBoard(colour)                  // Fill board x colour
{
    let temp = ctx.fillStyle;
    ctx.fillStyle = colour;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = temp;
}
function isTextSelected(x1,x2,y1,y2)       // Check is mouse intersects a rectangle
{
    if (mouseX > x1 && mouseX < x2
        && mouseY < y1 && mouseY > y2
        ) 
    return true;
    return false;
}
function startScreen()                                                                              // Start screen
{
    size = 70;
    fillBoard("orange");
    ctx.fillStyle="white";
    let centerX = canvas.width/2;
    ctx.fillText(startScreenText[0], centerX - startScreenText[0].length*size/2,100);         
    for (var i =1, y = 350; i < startScreenText.length; i++, y+=100)
    {
        if (isTextSelected(centerX - startScreenText[i].length*size/2, centerX + startScreenText[i].length*size/2, y, y - 100)) {
            ctx.fillStyle="yellow";
                if (mouseDown) 
                    changeScreenFade(i);
        }       else
                    ctx.fillStyle="white";
        ctx.fillText(startScreenText[i], centerX - startScreenText[i].length*size/2,y); 
    }
    mouseDown = false;
    if (mode == GAME_SCREEN)
        gameReset();
}
function pauseScreen()
{
    ctx.font= size + "px 'DotGothic16', sans-serif";
    ctx.fillStyle="white";
    let centerX = canvas.width/2;
    ctx.fillText(pauseScreenText[0], centerX - pauseScreenText[0].length*size/2,100);       // Game paused

    for (var i =1, y = 350; i < pauseScreenText.length; i++, y+=100)
    {
        if (isTextSelected(centerX - pauseScreenText[i].length*size/2, centerX + pauseScreenText[i].length*size/2, y, y - 100)) {
            ctx.fillStyle="yellow";
                if (mouseDown) {
                    pause = false;
                    changeScreenFade( ((i == 1)?GAME_SCREEN:START_SCREEN) );
                }
        }       else
                    ctx.fillStyle="white";
        ctx.fillText(startScreenText[i], centerX - startScreenText[i].length*size/2,y); 
    }
    mouseDown = false;
    if (pause)
        requestAnimationFrame(pauseScreen);
    else
        game();
}

function shipCoords(event)                                              // Get mouse coordinates for the ship
{
    mouseX = event.clientX;                                                 
    mouseY = event.clientY;
}
function movingStars()                                                      // Move stars across screen
{
    ctx.fillStyle="white";
    for (var i = 0; i < stars.length; i++)
    {
        ctx.beginPath();
        ctx.moveTo(stars[i].x* canvas.width/100, stars[i].y);
        //ctx.fillRect(stars[i].x * canvas.width/100, stars[i].y+=stars[i].velocity, 2, 2);
        ctx.lineTo(stars[i].x* canvas.width/100, stars[i].y+stars[i].length);
        stars[i].y+=stars[i].velocity;
        if (stars[i].y > canvas.height) {
            stars[i].y = -Math.random() * 100;
            stars[i].x =  Math.random() * 100;
        }
        ctx.stroke();
    }
        
}

let frame=0, xOff = 0;
function animateShip()                                                      // Move ship to pointer and animate
{ 
    // Set X and Y to mouse coordinates without breaking screen bounds
    ship.set((mouseX + imgWidth < window.innerWidth)?mouseX:ship.x, (mouseY > 0 && mouseY + imgWidth < window.innerHeight)?mouseY:ship.y);
    
    // Get frame and offset
    frame = (frame < 3) ? frame+1 : 0;
    xOff = ship.x - frame * imgWidth;

    // Animate ship:
    ctx.drawImage(shipImg, ship.x - (imgWidth * frame), ship.y);                               // Draw ship sheet
    ctx.clearRect(ship.x + imgWidth, ship.y, (ship.x + imgWidth) + (Math.abs(frame-3) * imgWidth), ship.y + imgWidth);  // Clear RHS
    ctx.clearRect(xOff, ship.y, imgWidth * frame, imgWidth);                                 // Clear LHS
}
function displayPoints(x,y,points)
{
    let str = points.toString();
    ctx.fillStyle="white";
    ctx.fillText(str, x,y);
}
function laserHitAsteroid(bullet, asteroids)
{
    let returnValue = false;
    for (var i = 0; i < asteroids.length; i++)
    {
        // If it hits then braek asteroid and add score
        if (bullet.y < asteroids[i].y + asteroids[i].size
            && bullet.y > asteroids[i].y
            && bullet.x < asteroids[i].x + asteroids[i].size
            && bullet.x > asteroids[i].x
            ) {
            score += Math.round(asteroids[i].size);
            asteroids[i].breakAway();
            
                return true;
            }
            // If asteroid has rocks recurse through to check if they have been hit
            if  (asteroids[i].rocks.length > 0 && !returnValue)
                returnValue = laserHitAsteroid(bullet, asteroids[i].rocks);
    }
    return returnValue;
}
function animateBullets()
{
    for (var i = 0; i < ship.bullets.length; i++)
    {
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
        if (ship.getLazerAt(i).y < 0) 
        {
            ship.bullets.reverse();                                         
            ship.bullets.pop();                                            
            ship.bullets.reverse();                                         
        }
        
    }

}
function movingAsteroid(boulder)
{
    for (var i = 0; i < boulder.length; i++)
    {
        boulder[i].move();
        ctx.drawImage(boulderImg, boulder[i].x, boulder[i].y, boulder[i].size, boulder[i].size);
        // If it hits ship then take damage
        if ( ship.x+ imgWidth >= boulder[i].x 
            && ship.y + imgWidth >= boulder[i].y
            && ship.x <= boulder[i].x + boulder[i].size
            && ship.y <= boulder[i].y + boulder[i].size
            ) { 
                if (!ship.invinsible)
                    boulder[i].breakAway();
                if (!extras[1])
                    ship.takeDamage();
             };
        if (boulder[i].rocks.length > 0 )
            movingAsteroid(boulder[i].rocks);
    }
}

function displayInfo()
{
    let margin = 10;
    ctx.font= scoreFontSize + "px 'DotGothic16', sans-serif";
    ctx.fillStyle="white";
    for (var i = 0; i < ship.health; i++)
        ctx.drawImage( ( (!extras[1]) ? heartImg : invinsibleHeartImg ), window.innerWidth - i * 1.1 * heartSize - (heartSize + margin), heartSize, heartSize, heartSize);
    ctx.fillText(score.toString(), window.innerWidth - score.toString().length * scoreFontSize/2 - margin, scoreFontSize);
}   


function playGame()                                                        // Main game function
{
    fillBoard("black");
    animateShip();
    movingStars();
    movingAsteroid(boulders);
    displayInfo();
    loopCount++;
    if (loopCount % 100 == 0) 
        timer += 1;
        if (loopCount % 1000 == 0 && !extras[1])
            ship.health++;
    // Add new asteroids at rate according to difficulty (settings[2])
    if (timer % parseInt(settingScreenText[4]) == 0) {
        for (var i = 0; i < timer/parseInt(settingScreenText[4]); i++)
            boulders.push(new Boulder(Math.random() * canvas.width, 0, 50 + Math.random() * 100));
        score += timer++ * 100 / parseInt(settingScreenText[4]);
    }
    if (mouseDown) {
        ship.addBullet(ship.x, ship.y);
        mouseDown = false;
    }
    if (ship.bullets.length > 0)
        animateBullets(ship);
}

function gameOver()
{
    fillBoard("orange");
    ctx.fillStyle="white";
    size= 70;
    ctx.font= size + "px 'DotGothic16', sans-serif";
    let centerX = canvas.width/2;

    ctx.fillText(gameOverTxt[0], canvas.width/2 - gameOverTxt[0].length*size/2,100);  

    ctx.fillText(gameOverTxt[1], centerX - gameOverTxt[1].length*size/2,350); 

    ctx.fillText(gameOverTxt[2], centerX - gameOverTxt[2].length*size/4,450); 

    if (isTextSelected(centerX - gameOverTxt[3].length*size/2, centerX + gameOverTxt[3].length*size/2, 550, 450)) {
        ctx.fillStyle="yellow";
            if (mouseDown) 
                changeScreenFade(START_SCREEN);
    }
    ctx.fillText(gameOverTxt[3], centerX - gameOverTxt[3].length*size/2,550); 

    mouseDown = false;   
}


function optionsScreen()
{
    size = 70;
    fillBoard("orange");
    ctx.fillStyle="white";
    let centerX = canvas.width/2;
    ctx.fillText(settingScreenText[0], centerX - settingScreenText[0].length*size/2,100);         
    for (var i =1, y = 250; i < settingScreenText.length; i++, y+=100)
    {
        if (i % 2 != 0) {
        if (isTextSelected(centerX - settingScreenText[i].length*size/2, centerX + settingScreenText[i].length*size/2, y, y - 100)) {
            ctx.fillStyle="yellow";
                if (mouseDown) 
                    switch(i) {
                        case 1:
                            settingScreenText[i+1]="" + ( (parseInt(settingScreenText[i+1])+1 <= 10) ? parseInt(settingScreenText[i+1])+1 : 3 );
                            mouseDown = false;
                        break;
                        case 3:
                            settingScreenText[i+1]="" + ( ( parseInt(settingScreenText[i+1])-2 >= 2) ?parseInt(settingScreenText[i+1])-2:7  );
                            mouseDown = false;
                            break;
                        case 5:
                            changeScreenFade(0);
                        break;
                    }
        }   }    else
                    ctx.fillStyle="white";
        if (i != 4)
            ctx.fillText(settingScreenText[i], centerX - settingScreenText[i].length*size/2,y); 
        else  {
            let txt;
            switch(parseInt(settingScreenText[4]))
            {
        
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
            ctx.fillText(txt, centerX - txt.length*size/2,y);
        }
    }
}
function extraCodeScreen()
{
    fillBoard("orange");
    ctx.font= size + "px 'DotGothic16', sans-serif";
    ctx.fillStyle="white";
    let centerX = canvas.width/2;
    ctx.fillText(extraList[0], centerX - extraList[0].length*size/2,100);       // Game paused

    for (var i =1, y = 350; i < extraList.length -1; i++, y+=100)
    {
        if (isTextSelected(centerX - extraList[i].length*size/2, centerX + extraList[i].length*size/2, y, y - 100)) {
            ctx.fillStyle="yellow";
            if (mouseDown)
            {
                // Toggle extras
                extras[i] = !extras[i];
            }
        }       else if (!extras[i])
                    ctx.fillStyle="white";
                else    
                    ctx.fillStyle="yellow";
        ctx.fillText(extraList[i], centerX - extraList[i].length*size/2,y); 
    }

    ctx.fillStyle="white";

    if (isTextSelected(centerX - extraList[extraList.length-1].length*size/2, centerX + extraList[extraList.length-1].length*size/2, 550, 450)) {
        ctx.fillStyle = "yellow";
        if (mouseDown)
            changeScreenFade(START_SCREEN);
    }
    
    ctx.fillText(extraList[extraList.length-1], centerX - extraList[extraList.length-1].length*size/2, 550);

    mouseDown = false;    

}
ctx.globalAlpha = 1.0;
var opacity = 0.1;
function changeScreenFade(newMode)
{

    document.body.style.cursor = (newMode == GAME_SCREEN) ? "none":"default";
    if (mode == GAME_SCREEN && ( newMode == START_SCREEN ||  newMode == GAME_OVER_SCREEN) )
    {
        // Fade in and out
        let nm = newMode;
        let opacity = 0.0;
        ctx.globalAlpha=0.0;
        for (var i = 0; i < 20; i++)
        {
            setTimeout(() => {
                opacity+=0.1;
                ctx.globalAlpha = Math.abs(1-opacity);
                if (opacity > 0.9) {
                    mode = nm;
                    ctx.font= size + "px 'DotGothic16', sans-serif";
                    ctx.strokeStyle="white";
                    document.body.style.cursor="default";
                    
                }
            }, 150 * i);

        }
    } else 
        mode=newMode;
}


function extraCodePrompt()
{
    let n = prompt("コードを入力します。");    
    if ( n == null || n == EXTRA_CODE
        
    ) mode =  ( (n == EXTRA_CODE) * 4);
}

mode = START_SCREEN;
function game()
{
    switch(mode) 
    {
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
        if (!ship.isWorking) 
        {
            gameOverTxt[2] = ""+score;
            ship.isWorking = true;
        }
            gameOver();
        break;

        default:
            gameOver();
        break;
    }
        if (!pause) 
            requestAnimationFrame(game);
        else {
            document.body.style.cursor="default";
            requestAnimationFrame(pauseScreen);
        }
}
////////////////////////////////////////////////////////////// Init  //////////////////////////////////////////////////////////////////
requestAnimationFrame(game);
for (var i = 0; i < 15; i++)                // Initialise stars
    stars.push(new Star(Math.random()*100, 0));

for (var i = 0; i < 5; i++)                 // Initialise Asteroids
        boulders.push(new Boulder(Math.random() * canvas.width, 0, 50 + Math.random() * 100));
adjustBoard();
canvas.style.position="absolute";
canvas.style.left=canvas.style.top="0px";
document.body.style.overflow="hidden";
startScreen();
ctx.font= size + "px 'DotGothic16', sans-serif";
ctx.strokeStyle="white";
document.body.style.background="black";
window.addEventListener("resize", ()=>{
    adjustBoard();
    ctx.strokeStyle="white";
    ctx.font=size + "px 'DotGothic16', sans-serif";
});
window.addEventListener("mousedown", () => {
    mouseDown = true;
});
window.addEventListener("mouseup", ()=> {
    mouseDown = false;
});