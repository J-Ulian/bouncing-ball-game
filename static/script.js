minHeight = 20;
maxHeight = 100;
minWidth = 10;
maxWidth = 20;
minGap = 200;
maxGap = 500;
gap = randGap();
const audio = document.getElementById('audio');
const audio1 = document.getElementById('audio1');
// массив препятствий
const myObstacles = [];
const colors = ['#fab2ce', '#f44c8d', '	#f0005d', '	#a80041', '#48001b'];
var myGamePiece;

function startGame() {
    gamearea.start();
}
// frame считает сколько раз исполнялось updateGameArea
function everyinterval(n) {
    if (gamearea.frame % n == 0) return true;
    return false;
}

function jump() {
    player.speedY = -2;
    audio.play();
}

function randGap() {
    // рандомный промежуток между минимальным и максимальным расстоянием
    return Math.floor(minGap + Math.random() * (maxGap - minGap + 1));
}

const scoreText = {
    x: 900,
    y: 50,
    update: function (text) {
        gamearea.context.fillStyle = 'gray';
        gamearea.context.font = '30px Consolas';
        gamearea.context.fillText(text, this.x, this.y);
    },
};

// добавляем игрока

const player = {
    x: 30,
    y: 480,
    speedY: 0,
    update: function () {
        gamearea.context.fillStyle = 'white';

        gamearea.context.beginPath();
        gamearea.context.arc(this.x, this.y, 20, 30, Math.PI * 2, true);
        gamearea.context.fill();
    },
    // смена координат
    newPos: function () {
        if (this.y < 280) {
            this.speedY = 2;
        }
        this.y = this.y + this.speedY;
        if (this.speedY === 2 && this.y === 480) {
            this.speedY = 0;
        }
    },
    crashWith: function (obs) {
        if (
            this.x + 20 > obs.x &&
            this.x < obs.x + obs.width &&
            this.y + 20 > obs.y
        ) {
            return true;
        }
        return false;
    },
};
// класс препятствий
function obstacle() {
    this.height = Math.floor(
        minHeight + Math.random() * (maxHeight - minHeight + 1)
    );
    this.width = Math.floor(
        minWidth + Math.random() * (maxWidth - minWidth + 1)
    );
    this.x = 1200;
    this.y = gamearea.canvas.height - this.height;
    this.index = Math.floor(Math.random() * colors.length);
    this.color = colors[this.index];
    // рисуем
    this.draw = function () {
        gamearea.context.fillStyle = this.color;
        gamearea.context.fillRect(this.x, this.y, this.width, this.height);
    };
}

const gamearea = {
    canvas: document.createElement('canvas'),
    start: function () {
        // высота и ширина игры
        this.canvas.height = 500;
        this.canvas.width = 1200;
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.context = this.canvas.getContext('2d');
        this.frame = 0;
        this.score = 0;
        scoreText.update('Score: 0');
        // обновляем игру каждые 5мс
        this.interval = setInterval(this.updateGameArea, 5);
        window.addEventListener('keydown', jump);
        audio1.play();
    },
    updateGameArea: function () {
        // проверяем не врезались ли мы
        for (i = 0; i < myObstacles.length; i++) {
            if (player.crashWith(myObstacles[i])) {
                gamearea.stop();
                return;
            }
        }
        if (gamearea.score > 100) {
            gamearea.stop();
            return;
        }

        gamearea.clear();
        // после каждых 150 раз выполнения updateGameArea добавляем препятсвие
        if (everyinterval(gap)) {
            myObstacles.push(new obstacle());
            gap = randGap();
            gamearea.frame = 0;
        }
        for (i = 0; i < myObstacles.length; i++) {
            myObstacles[i].x -= 1;
            myObstacles[i].draw();
        }
        player.newPos();
        player.update();
        gamearea.frame += 1;
        gamearea.score += 0.01;
        scoreText.update('Score: ' + Math.floor(gamearea.score));
    },
    clear: function () {
        gamearea.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    },
    stop: function () {
        clearInterval(this.interval);
        if (gamearea.score < 100) {
            alert('Game over (*_*) !! ');
        } else {
            alert('You Won !!!');
        }
        audio1.play();
    },
};