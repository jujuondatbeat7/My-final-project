// Section switching
function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Simple Pong Game
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 4, dy: 4, radius: 10 };
let paddle = { x: 0, y: canvas.height / 2 - 50, width: 10, height: 100 };
let aiPaddle = { x: canvas.width - 10, y: canvas.height / 2 - 50, width: 10, height: 100 };
let score = { player: 0, ai: 0 };
let gameRunning = false;

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '20px Courier New';
    ctx.fillText(text, x, y);
}

function update() {
    if (!gameRunning) return;

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if (ball.x - ball.radius < paddle.x + paddle.width && ball.y > paddle.y && ball.y < paddle.y + paddle.height) {
        ball.dx = -ball.dx;
    }

    if (ball.x + ball.radius > aiPaddle.x && ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
        ball.dx = -ball.dx;
    }

    // Score
    if (ball.x < 0) {
        score.ai++;
        resetBall();
    }

    if (ball.x > canvas.width) {
        score.player++;
        resetBall();
    }

    // AI paddle movement
    aiPaddle.y = ball.y - aiPaddle.height / 2;

    // Keep AI paddle in bounds
    if (aiPaddle.y < 0) aiPaddle.y = 0;
    if (aiPaddle.y + aiPaddle.height > canvas.height) aiPaddle.y = canvas.height - aiPaddle.height;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    drawRect(paddle.x, paddle.y, paddle.width, paddle.height, '#00ffff');
    drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, '#ff00ff');

    // Draw ball
    drawCircle(ball.x, ball.y, ball.radius, '#ffff00');

    // Draw score
    drawText(score.player, canvas.width / 4, 30, '#00ffff');
    drawText(score.ai, 3 * canvas.width / 4, 30, '#ff00ff');

    // Draw center line
    for (let i = 0; i < canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, '#ffffff');
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Mouse movement for paddle
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    paddle.y = e.clientY - rect.top - paddle.height / 2;

    // Keep paddle in bounds
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y + paddle.height > canvas.height) paddle.y = canvas.height - paddle.height;
});

// Start game on click
canvas.addEventListener('click', () => {
    if (!gameRunning) {
        gameRunning = true;
        resetBall();
    }
});

// Start game loop
gameLoop();

// Show about section by default
showSection('about');