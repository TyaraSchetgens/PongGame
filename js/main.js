window.addEventListener("load", init);

const PADDLE_THICKNESS = 10;
const WINNING_SCORE = 3;

//BALL OBJECT
var ball = {
    X: 50,
    Y: 50,

    speedX: 10,
    speedY: 3,
    radius: 10
};


//PLAYER OBJECT
var player = {
    PosY: 250,
    score: 0,
    paddleHeight: 100
};

//COMPUTER PLAYER OBJECT
var computer = {
    posY: 250,
    score: 0,

    paddleHeight: 100
};

var canvas, 
    ctx, 
    backgroundMusic, 
    screenImages,
    showStartScreen,
    showGameOverScreen,
    showNextLevelScreen,
    showPauseScreen,
    backgroundMusicPlaying,
    framesPerSecond;

// Setup of basis game variables
backgroundMusicPlaying = true;
framesPerSecond = 30;
showStartScreen = true;            
showGameOverScreen = showNextLevelScreen = showPauseScreen = false;              

function init() {
    initAudio();  // TO INITIALISE THE AUDIO
    initImages(); // TO INITIALISE THE IMAGE 
    initCanvas(); // TO INITIALISE THE CANVAS
}

function initCanvas() {
    canvas = document.getElementById("myCanvas");
    
    if(isCanvasSupported() && doesCanvasExist(myCanvas)) {
        ctx = myCanvas.getContext('2d');
          
        
    setInterval(function() {
        startTheApp();
    }, 1000/framesPerSecond);
        
        
    }   
}

function startTheApp() {    
    canvas.addEventListener('mousedown',
        function(evt) {
            if(showGameOverScreen) {
                player.score = 0;
                computer.score = 0;
                player.paddleHeight = 100;
                
                showGameOverScreen = !showGameOverScreen;
            } else if (showStartScreen) {
                showStartScreen = !showStartScreen;
            } else if (showNextLevelScreen) {
                player.score = 0;
                computer.score = 0;
                
                player.paddleHeight -= 20;     //MAKING IT HARDER BY DECREASING PADDLE HEIGHT
                
                showNextLevelScreen = !showNextLevelScreen;
            }
    })
    
    canvas.addEventListener('mousemove', 
        function(evt) {
            var mousePos = getMousePos(evt)
            player.posY = mousePos.y-(player.paddleHeight/2);
    })
    
    window.addEventListener("keydown",
        function onkeyPressed(event) {
            if(event.keyCode == 32) {           //SPACEBAR KEY
                mutebackgroundMusic();
            } else if(event.keyCode == 16) {     //SHIFT KEY
                showPauseScreen = !showPauseScreen;
                }}, true)
    
    moveEverything();
    drawEverything();    
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function moveEverything() {
    if(showStartScreen ||
       showGameOverScreen || 
       showNextLevelScreen ||
       showPauseScreen
        == true) {
        return;
    }
    
    ball.X += ball.speedX;
    ball.Y += ball.speedY;
    

    ballOnEdgesOfScreenCheck();
    computerMovement();
}


function drawEverything() {
    //BACKGROUND
    drawRect(0,0,canvas.width, canvas.height, '#000'); 
    
    //DRAW MIDDLE NET
    drawNet();
    
    //LEFT PADDLE (PLAYER)
    drawRect(0, player.posY, PADDLE_THICKNESS, player.paddleHeight, "#56f"); 
    //RIGHT PADDLE (COMPUTER)
    drawRect(canvas.width - PADDLE_THICKNESS, computer.posY, PADDLE_THICKNESS, computer.paddleHeight, "#f56");   
    drawCircle(ball.X, ball.Y, ball.radius, "#fff"); 
    
    score(100, 100);
    
    checkIfScreensNeedToBeDrawn(); // NEEDS TO BE LAST IN FUNCTION!!
}
    
    
//////////////////////////////////////////////////////////////////////////////////////////////
                                    //==FUNCTIONS==
//////////////////////////////////////////////////////////////////////////////////////////////
// 2 FUNCTIOS TO CHECK IF CANVAS IS SUPPORTED BY BROWSER
function isCanvasSupported(){
    var check = document.createElement("canvas");
    return !!(check.getContext && check.getContext('2d'));
}

function doesCanvasExist(elem){
    return !!(elem);
}
//////////////////////////////////////////////////////////////////////////////////////////////
//INITIALISING THE AUDIO
function initAudio(){
    backgroundMusic = new Audio;
    backgroundMusic.src = "sounds/backgroundMusic.mp3"; // BRON: TITANIC THE MOVIE
    backgroundMusic.play();
}
//-------------------------------------------------------------------
function mutebackgroundMusic() {
backgroundMusicPlaying = !backgroundMusicPlaying;
    
    if (backgroundMusicPlaying){
        backgroundMusic.loop = true;
        backgroundMusic.muted = false;
        backgroundMusic.play();
    } else {
        backgroundMusic.muted = true;        
    }
    
}
//-------------------------------------------------------------------
function initImages() {
    //SPRITE SCREEN IMAGES
    screenImages = new Image();
    screenImages.src = "img/screenImages.png";
}

//-------------------------------------------------------------------
//TRACKING MOUSE POSITION FOR MOVEMENT OF PADDLES
function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    
    return {
        x: mouseX,
        y: mouseY
    }
}

//-------------------------------------------------------------------
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

//-------------------------------------------------------------------
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.fill();
}
//-------------------------------------------------------------------
function ballReset() {
    if( player.score >= WINNING_SCORE) {
        showNextLevelScreen = true;
    } else if (computer.score >= WINNING_SCORE) {
        showGameOverScreen = true;
    }
    
    ball.speedX = -ball.speedX;
    ball.X = canvas.width/2;
    ball.X = canvas.width/2;
}

//-------------------------------------------------------------------
function ballOnEdgesOfScreenCheck() {
    //HORIZONTALE BEWEGING BALL
    if(ball.X > canvas.width - PADDLE_THICKNESS) {        
        if(ball.Y > computer.posY && ball.Y < computer.posY + computer.paddleHeight) {
            ball.speedX = -ball.speedX;
            
            var difY = ball.Y - (computer.posY+computer.paddleHeight/2);
            ball.speedY = difY * 0.30;
        } else {
            player.score++; //DIT MOET VOOR balReset() staan!!
            ballReset();
        }
    }
    
    if(ball.X < PADDLE_THICKNESS) {
        if(ball.Y > player.posY && ball.Y < player.posY + player.paddleHeight) {
            ball.speedX = -ball.speedX;
            
            var difY = ball.Y - (player.posY+player.paddleHeight/2);
            ball.speedY = difY * 0.275;
            
        } else {
            computer.score++; //DIT MOET VOOR balReset() staan!!
            ballReset();
        }
    }
    
    //VERTICALE BEWEGING BALL
    if(ball.Y >= canvas.height) {
        ball.speedY = -ball.speedY;
    } 
    
    if(ball.Y <= 0) {
       ball.speedY = -ball.speedY;
    }
}

//-------------------------------------------------------------------
function computerMovement() {
    var computerPaddleCenter = computer.posY + (computer.paddleHeight/2);
    if(ball.Y > computerPaddleCenter + 20) {
        computer.posY += 6;
    }
    
    else  if(ball.Y < computerPaddleCenter - 20) {
        computer.posY -= 6;
    }
}

//-------------------------------------------------------------------
function score(posX, posY) {
    ctx.fillStyle='#fff';
    ctx.fillText('Player one score ' + player.score, posX, posY);
    ctx.fillText('Player two score ' + computer.score, canvas.width - posX*2, posY);
}

//-------------------------------------------------------------------
function drawNet() {
    for(var i = 0; i < canvas.height; i+= 40) {
        drawRect(canvas.width/2 - 1, i, 2, 20, '#fff');
    }
}

//-------------------------------------------------------------------
function checkIfScreensNeedToBeDrawn() {
    if(showStartScreen == true) {
        drawStartScreen();   
    }
    
    if(showGameOverScreen == true) {
        drawGameOverScreen();
    }
    
    if(showNextLevelScreen == true) {
        drawNextLevelScreen();
    }
    
    if(showPauseScreen == true) {
        drawPauseScreen();
    }
}

//-------------------------------------------------------------------
//DRAWING THE DIFFERENT SCREENS
function drawStartScreen() {
    ctx.drawImage(screenImages, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
}

//-------------------------------------------------------------------
function drawGameOverScreen() {
    ctx.drawImage(screenImages, 0, canvas.height*3, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
}

//-------------------------------------------------------------------
function drawNextLevelScreen() {
    ctx.drawImage(screenImages, 0, canvas.height*2, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
}

//-------------------------------------------------------------------
function drawPauseScreen() {
    ctx.drawImage(screenImages, 0, canvas.height, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
}

//-------------------------------------------------------------------     
        
        
