var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var numberOfBricksRow = 12;
var numberOfBricksColumn = 12;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var poens = 0;
var numberOfLives = 3;
var round = 1;

document.addEventListener("mousemove", mouseMoveHandler, false);
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.width / 2;
    }
}


let ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    directionX: 2,
    directionY: -2,
    radius: 10,
    ballColor: "#fff",
    draw: function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.ballColor;
        ctx.fill();
        ctx.closePath();
    },
    move: function () {
        this.x += this.directionX;
        this.y += this.directionY;
    },
    checkCollision: function () {
        if (this.x + this.directionX > canvas.width - this.radius || this.x + this.directionX - this.radius < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y + this.directionY - this.radius < 0) {
            this.directionY = -this.directionY;
        }
        else if (this.y + this.directionY > canvas.height - this.radius) {
            if (this.x > paddle.x && this.x < paddle.x + paddle.width) {
                this.directionY = -this.directionY;
            }
            else {
                numberOfLives--;
                if (!numberOfLives) {
                    alert("GAME OVER");
                    document.location.reload();
                }
                else {
                    this.x = canvas.width / 2;
                    this.y = canvas.height - 30;
                    this.directionX = 3;
                    this.directionY = -3;
                    paddle.x = (canvas.width - paddle.width) / 2;
                }
            }
        }
    }
};

let paddle = {
    width: 80,
    height: 10,
    x: (canvas.width - 80) / 2,
    directionX: 7,
    color: "#fff",
    draw: function () {
        ctx.beginPath();
        ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

}
var bricks = [];
for (var c = 0; c < numberOfBricksRow; c++) {
    bricks[c] = [];
    for (var r = 0; r < numberOfBricksColumn; r++) {
        bricks[c][r] = {
            width: 70,
            height: 20,
            color: "#D50000",
            x: 0,
            y: 0,
            visible: 1,
            padding: 10,
            draw: function () {
                ctx.beginPath();
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.closePath();
            }
        };
    }
}

function collisionDetection() {
    for (let i = 0; i < numberOfBricksRow; i++) {
        for (let j = 0; j < numberOfBricksColumn; j++) {
            var b = bricks[i][j];
            if (b.visible == 1) {
                if (ball.x > b.x && ball.x < b.x + b.width && ball.y > b.y && ball.y < b.y + b.height) {
                    ball.directionY = -ball.directionY;
                    b.visible = 0;
                    poens++;
                    if (poens/round == numberOfBricksRow * numberOfBricksColumn) {
                        resetBricks();
                        drawBricks();
                        round++;
                    }
                }
            }
        }
    }
}

function resetBricks() {
    for (let i = 0; i < numberOfBricksRow; i++) {
        for (let j = 0; j < numberOfBricksColumn; j++) {
            bricks[i][j].visible = 1;
        }
    }
}

function drawBricks() {
    for (let i = 0; i < numberOfBricksRow; i++) {
        for (let j = 0; j < numberOfBricksColumn; j++) {
            if (bricks[i][j].visible == 1) {
                let brickX = (i * (bricks[i][j].width + bricks[i][j].padding)) + brickOffsetLeft;
                let brickY = (j * (bricks[i][j].height + bricks[i][j].padding)) + brickOffsetTop;
                bricks[i][j].x = brickX;
                bricks[i][j].y = brickY;
                bricks[i][j].draw();
            }
        }
    }
}
function score() {
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText("Score: " + poens, 8, 20);
}
function lives() {
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText("Lives: " + numberOfLives, canvas.width - 75, 20);
}

function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    score();
    lives();
    drawBricks();
    ball.draw();
    paddle.draw();
    collisionDetection();

    ball.checkCollision();
    ball.move();

    requestAnimationFrame(main);
}

main();