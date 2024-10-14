const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const BLOCK_SIZE = 20;
let score = 0;
let level = 1;
const scoreDisplay = document.getElementById('score');

// Define simple maps for each level (0 = dot, 1 = wall)
const maps = [
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];

let pacman = { x: BLOCK_SIZE * 5, y: BLOCK_SIZE * 5, speed: BLOCK_SIZE, direction: 'RIGHT' };
let ghost = { x: BLOCK_SIZE * 2, y: BLOCK_SIZE * 2, speed: BLOCK_SIZE };

let currentMap = maps[level - 1];

function drawMap(map) {
    for (let row = 0; row < map.length; row++) {
        for (let col = 0; col < map[row].length; col++) {
            if (map[row][col] === 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            } else if (map[row][col] === 0) {
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(col * BLOCK_SIZE + BLOCK_SIZE / 2, row * BLOCK_SIZE + BLOCK_SIZE / 2, BLOCK_SIZE / 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function movePacman() {
    if (pacman.direction === 'RIGHT') pacman.x += pacman.speed;
    if (pacman.direction === 'LEFT') pacman.x -= pacman.speed;
    if (pacman.direction === 'UP') pacman.y -= pacman.speed;
    if (pacman.direction === 'DOWN') pacman.y += pacman.speed;

    pacman.x = Math.max(0, Math.min(pacman.x, canvas.width - BLOCK_SIZE));
    pacman.y = Math.max(0, Math.min(pacman.y, canvas.height - BLOCK_SIZE));
}

function drawPacman() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x + BLOCK_SIZE / 2, pacman.y + BLOCK_SIZE / 2, BLOCK_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
}

function moveGhost() {
    const directions = ['RIGHT', 'LEFT', 'UP', 'DOWN'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];

    if (randomDirection === 'RIGHT') ghost.x += ghost.speed;
    if (randomDirection === 'LEFT') ghost.x -= ghost.speed;
    if (randomDirection === 'UP') ghost.y -= ghost.speed;
    if (randomDirection === 'DOWN') ghost.y += ghost.speed;

    ghost.x = Math.max(0, Math.min(ghost.x, canvas.width - BLOCK_SIZE));
    ghost.y = Math.max(0, Math.min(ghost.y, canvas.height - BLOCK_SIZE));
}

function drawGhost() {
    ctx.fillStyle = 'red';
    ctx.fillRect(ghost.x, ghost.y, BLOCK_SIZE, BLOCK_SIZE);
}

function checkCollision() {
    if (pacman.x === ghost.x && pacman.y === ghost.y) {
        alert('Game Over!');
        document.location.reload();
    }
}

function eatDots(map) {
    const row = pacman.y / BLOCK_SIZE;
    const col = pacman.x / BLOCK_SIZE;

    if (map[row][col] === 0) {
        map[row][col] = -1;
        score += 10;
        scoreDisplay.textContent = score;
    }
}

function checkLevelCompletion(map) {
    if (map.flat().every(cell => cell !== 0)) {
        alert('Stage Completed!');
        level += 1;
        if (level > maps.length) {
            alert('You win!');
            document.location.reload();
        } else {
            currentMap = maps[level - 1];
        }
    }
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') pacman.direction = 'RIGHT';
    if (e.key === 'ArrowLeft') pacman.direction = 'LEFT';
    if (e.key === 'ArrowUp') pacman.direction = 'UP';
    if (e.key === 'ArrowDown') pacman.direction = 'DOWN';
});

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap(currentMap);
    movePacman();
    drawPacman();
    moveGhost();
    drawGhost();
    checkCollision();
    eatDots(currentMap);
    checkLevelCompletion(currentMap);

    requestAnimationFrame(gameLoop);
}

gameLoop();
