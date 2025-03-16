const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Character properties
let characterSize = 160;
let groundLevel = canvas.height - characterSize - 50;

let leftCharacter = { x: 100, y: groundLevel, velocity: 0.5 };
let rightCharacter = { x: canvas.width - 100 - characterSize, y: groundLevel, velocity: -0.5 };
let moving = false;
let showHeart = false;
let heartParticles = [];
let message = "";
let conversation = [
    { left: "Hi!", right: "Hello!" },
    { left: "You look familiar...", right: "Do I? Maybe it's fate! 💖" },
    { left: "Maybe... Have we met before?", right: "It feels like we were meant to!" },
    { left: "How are you?", right: "My heart is racing seeing you! 💕" },
    { left: "Me too!", right: "Together forever!" },
    { left: "😻", right: "🥰" }
];
let messageIndex = 0;
let messageTimer = 0;

// Load background image
const background = new Image();
background.src = "backgroundImage.jpg";

// Load blue and pink cat images
const blueCat = new Image();
blueCat.src = "blueCatStanding.png";

const pinkCat = new Image();
pinkCat.src = "pinkCatStanding.png";

// Snowfall effect
const snowCanvas = document.createElement("canvas");
document.body.appendChild(snowCanvas);
snowCanvas.width = window.innerWidth;
snowCanvas.height = window.innerHeight;
const ctxSnow = snowCanvas.getContext("2d");
const snowflakes = [];

function createSnowflake() {
    return {
        x: Math.random() * snowCanvas.width,
        y: Math.random() * snowCanvas.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
    };
}

for (let i = 0; i < 100; i++) {
    snowflakes.push(createSnowflake());
}

function updateSnowflakes() {
    for (let flake of snowflakes) {
        flake.y += flake.speed;
        if (flake.y > snowCanvas.height) {
            flake.y = -flake.radius;
            flake.x = Math.random() * snowCanvas.width;
        }
    }
}

function drawSnowflakes() {
    ctxSnow.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    ctxSnow.fillStyle = "rgba(235, 221, 221, 0.8)";
    for (let flake of snowflakes) {
        ctxSnow.beginPath();
        ctxSnow.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctxSnow.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctxSnow.fill();
    }
}
// Snowfall effect

// Function to create a snowflake with more varied properties
function createSnowflake() {
    return {
        x: Math.random() * snowCanvas.width,
        y: Math.random() * snowCanvas.height,
        radius: Math.random() * 5 + 2, // Increased size range
        speed: Math.random() * 2 + 1, // Increased speed range
        opacity: Math.random() * 0.5 + 0.5, // Increased minimum opacity
    };
}

// Increase the number of snowflakes
for (let i = 0; i < 200; i++) { // Increased from 100 to 200
    snowflakes.push(createSnowflake());
}

function updateSnowflakes() {
    for (let flake of snowflakes) {
        flake.y += flake.speed;
        if (flake.y > snowCanvas.height) {
            flake.y = -flake.radius;
            flake.x = Math.random() * snowCanvas.width;
        }
    }
}

function drawSnowflakes() {
    ctxSnow.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    ctxSnow.fillStyle = "rgba(255, 255, 255, 0.8)";
    for (let flake of snowflakes) {
        ctxSnow.beginPath();
        ctxSnow.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctxSnow.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctxSnow.fill();
    }
}

function loopSnow() {
    updateSnowflakes();
    drawSnowflakes();
    requestAnimationFrame(loopSnow);
}
loopSnow();
function loopSnow() {
    updateSnowflakes();
    drawSnowflakes();
    requestAnimationFrame(loopSnow);
}
loopSnow();

// Heart explosion effect
class Particle {
    constructor(x, y, color, size) {
        this.x = x;
        this.y = y;
        this.radius = size || Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 1.5) * 2;
        this.alpha = 1;
        this.color = color;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// Function to start movement
function startMovement() {
    leftCharacter.velocity = 0.5;
    rightCharacter.velocity = -0.5;
    moving = true;
}

// Update character positions
function update() {
    if (moving) {
        leftCharacter.x += leftCharacter.velocity;
        rightCharacter.x += rightCharacter.velocity;

        if (leftCharacter.x + characterSize >= rightCharacter.x) {
            leftCharacter.x = rightCharacter.x - characterSize;
            moving = false;
            showHeart = true;
            message = "Together forever! 💕";
            createHeartExplosion();
        }
    }

    if (moving && messageTimer % 100 === 0 && messageIndex < conversation.length - 1) {
        messageIndex++;
    }
    messageTimer++;

    heartParticles.forEach((particle, index) => {
        particle.update();
        if (particle.alpha <= 0) {
            heartParticles.splice(index, 1);
        }
    });
}

// Create heart explosion particles in a heart shape
function createHeartExplosion() {
    let heartX = (leftCharacter.x + rightCharacter.x) / 2 + characterSize / 2;
    let heartY = groundLevel - 40;

    for (let i = 0; i < 100; i++) {
        let angle = Math.PI * 2 * (i / 100);
        let x = heartX + 50 * Math.pow(Math.sin(angle), 3);
        let y = heartY - (40 * Math.cos(angle) - 20 * Math.cos(2 * angle) - 10 * Math.cos(3 * angle) - 5 * Math.cos(4 * angle));
        heartParticles.push(new Particle(x, y, "rgba(255, 120, 255, 1)", 8));
    }
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(blueCat, -leftCharacter.x - characterSize, leftCharacter.y, characterSize, characterSize);
    ctx.restore();
    
    ctx.drawImage(pinkCat, rightCharacter.x, rightCharacter.y, characterSize, characterSize);
    
    heartParticles.forEach(particle => particle.draw());
    
    ctx.font = "24px 'Courier New', monospace";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(conversation[messageIndex].left, leftCharacter.x + characterSize / 2, leftCharacter.y - 20);
    ctx.fillText(conversation[messageIndex].right, rightCharacter.x + characterSize / 2, rightCharacter.y - 20);
    
    if (showHeart) {
        ctx.font = "36px 'Courier New', monospace";
        ctx.fillText(message, canvas.width / 2, groundLevel - 100);
    }
}

// Game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
loop();
window.addEventListener("click", () => {
    const bgMusic = document.getElementById("bgMusic");
    if (bgMusic.paused) {
        bgMusic.play();
    }
}, { once: true }); // Ensures it runs only once
