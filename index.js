/**@type {HTMLCanvasElement} */

// alert("INSTRUCTIONS:\nPlayer1:\n 'W' = moveup\n 'S' = movedown\n\nPlayer2:\n 'O' = moveup\n 'L' = movedown")

// -------------------------------- SRJ Changes ----------------------
let startTime;
let elapsedTime = 0;
let timerInterval;
function startStopwatch() {
    
    // Store the current time when starting the stopwatch
    startTime = new Date().getTime() - elapsedTime;

    // Update the stopwatch display every 10 milliseconds
    timerInterval = setInterval(updateStopwatchDisplay, 10);
}
function updateStopwatchDisplay() {
    // Calculate the elapsed time since starting the stopwatch
    const currentTime = new Date().getTime();
    elapsedTime = currentTime - startTime;

    // Format the elapsed time
    const formattedTime = formatTime(elapsedTime);

    // Display the formatted time
    document.getElementById('stopwatch').innerText = formattedTime;
}

// Function to format the time in HH:MM:SS format
function formatTime(time) {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((time % 1000) / 10);

    return (
        pad(hours) + ':' +
        pad(minutes) + ':' +
        pad(seconds) + ':' +
        pad(milliseconds)
    );
}

// Function to add leading zeros to single-digit numbers
function pad(number) {
    return (number < 10 ? '0' : '') + number;
}

// Function to stop the stopwatch
function stopStopwatch() {
    clearInterval(timerInterval);
}

// for game over msg
function showGameOverMessage() {
    document.getElementById('gameOverMessage').classList.remove('hidden');
    let rematchBtn = document.getElementById('rematchButton');
    rematchBtn.focus();
}

// --------------------------------------------------------------
let canvas = document.getElementById('canvas')
let c = canvas.getContext('2d')

let CANVAS_WIDTH = canvas.width
let CANVAS_HEIGHT = canvas.height

let gameOver = false

class Ball {
    constructor(x, y, radius, velocityX, velocityY) {
        this.x = x
        this.y = y
        this.radius = radius
        this.velocityX = velocityX
        this.velocityY = velocityY
    }

    update() {
        if (this.x + this.radius >= CANVAS_WIDTH) {
            let ballUpperPart = this.y - this.radius
            let ballLowerPart = this.y + this.radius
            if ((ballUpperPart > p2.y && ballUpperPart < p2.y+p2.height) || (ballLowerPart > p2.y && ballLowerPart < p2.y+p2.height)) {
                this.velocityX *= -1
                this.x = CANVAS_WIDTH - this.radius - 1
            }
            else{
                // ! Here
                // alert("Player 1 Won The Game")
             
                gameOver = true

            }
        }
        if (this.x - this.radius <= 0) {
            let ballUpperPart = this.y - this.radius
            let ballLowerPart = this.y + this.radius
            if ((ballUpperPart > p1.y && ballUpperPart < p1.y+p1.height) || (ballLowerPart > p1.y && ballLowerPart < p1.y+p1.height)) {
                this.velocityX *= -1
                this.x = this.radius + 1
            }
            else{
                // ! Here ~ bhai isse dhundne mein 1 ghanta lag gya , kuch cmt maar dia kro yrr
                // alert("Player 2 Won The Game")
                
                gameOver = true

            }
        }
       
        if (this.y + this.radius >= CANVAS_HEIGHT) {
            this.velocityY *= -1
            this.y = CANVAS_HEIGHT - this.radius - 1
        }
        if (this.y - this.radius <= 0) {
            this.velocityY *= -1
            this.y = this.radius + 1
        }
        this.x += this.velocityX
        this.y += this.velocityY
        this.render()
    }

    render() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        c.fillStyle = 'white';
        c.fill();
    }
}

let ball = new Ball(
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2,
    20,
    2 * (Math.random() >= 0.5 ? 1 : -1),
    2 * (Math.random() >= 0.5 ? 1 : -1)
)

class Player {
    constructor(x, y, height, width, velocity) {
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.velocity = velocity
    }

    update() {
        if (this.y + this.velocity >= 0 && this.y + this.height + this.velocity <= CANVAS_HEIGHT) this.y += this.velocity
    }

    render() {
        this.update()
        c.fillStyle = 'white'
        c.fillRect(this.x, this.y, this.width, this.height)
    }
}

let p1 = new Player(0, 50, 180, 20, 10)
let p2 = new Player(CANVAS_WIDTH - 20, 70, 180, 50, 10)

document.querySelector('body').addEventListener('keypress', (e) => {
    let key = e.key
    console.log(e)
    if ((key === 'w' && p1.velocity > 0) || (key === 's' && p1.velocity < 0)) p1.velocity *= -1
    if ((key === 'o' && p2.velocity > 0) || (key === 'l' && p2.velocity < 0)) p2.velocity *= -1
})

let ballSpeedAccelerator = 0
function animate() {
   
    c.fillStyle = 'black'
    c.fillRect(0, 0, 1280, 720)

    ball.update()
    p1.render()
    p2.render()

    if(++ballSpeedAccelerator > 100){
        ballSpeedAccelerator = 0
        ball.velocityX>0? ball.velocityX++ : ball.velocityX--
        ball.velocityY>0? ball.velocityY++ : ball.velocityY--
    }
    if(!gameOver) requestAnimationFrame(animate)
    else{
        stopStopwatch();
        showGameOverMessage();
        // window.location.reload();
    }
}
// animate()    -> moved to end welcome function
function welcomeMessage(){
    document.getElementById('welcomeMessage').classList.remove('hidden');
}
// function endWelcome(){
//     // document.getElementById('welcomeMessage').style.display = "none";
//     document.getElementById('welcomeMessage').classList.add('hidden');
//     animate();
// }
