var FPS = 30;
var RADIUS = 8;
var VELOCITY = 2 * RADIUS;

var canvas;
var ctx;

var score;
var keys;
var player;
var tails;
var nom;

var lose;
var paused;

var COLORS = {
	player: "#00f",
	tail: "#ee0",
	nom: "#0f0"
};

var KEYBIND = {
	up: 87,
	left: 65,
	down: 83,
	right: 68,
	pause: 80,
	start: 13
};

window.onload = init;

function init() {
	canvas = document.getElementById("canvas");
	canvas.height = VELOCITY * FPS;
	canvas.width = VELOCITY * FPS;
	ctx = canvas.getContext("2d");
	score = document.getElementById("score");
	initBoard();
	start();
}

function start() {
	addEventListener("keydown", keyDown);
	setInterval(update, 1000/FPS);
}

function initBoard() {
	tails = [];
	player = {
		x: RADIUS,
		y: Math.round((canvas.height - VELOCITY) / 2 / VELOCITY) * VELOCITY + RADIUS
	};
	nom = {
		x: -RADIUS,
		y: -RADIUS
	};
	keys = {
		up: false,
		left: false,
		down: false,
		right: true
	};
	lose = true;
	paused = false;
	score.innerHTML = 0;
	
	draw();
}

function dropNom() {
	nom = {
		x: Math.round(Math.random() * (canvas.width - VELOCITY) / VELOCITY) * VELOCITY + RADIUS,
		y: Math.round(Math.random() * (canvas.height - VELOCITY) / VELOCITY) * VELOCITY + RADIUS
	};
}

function addTail(xPos,yPos) {
	var tail = {
		x: xPos,
		y: yPos
	};
	
	tails.push(tail);
}

function draw() {
	ctx.clearRect(0,0,canvas.width, canvas.height);
	
	//Draw the Tails//
	for(var i = 0; i < tails.length; i++) {
		var tail = tails[i];
		drawCircle(tail.x, tail.y, COLORS.tail);
	}
	
	//Draw the nom//
	drawCircle(nom.x, nom.y, COLORS.nom);
	
	//Draw the player//
	drawCircle(player.x, player.y, COLORS.player);
}

function drawCircle(x, y, c) {
	ctx.beginPath();
	ctx.arc(x, y, RADIUS, 0, 2*Math.PI);
	ctx.fillStyle = c;
	ctx.fill();
	ctx.stroke();
}

function keyDown(e) {
	if(lose && e.which == KEYBIND.start) {
                paused = false;
        }
        if(paused && e.which != KEYBIND.pause) {
                return;
        }
	switch(e.which) {
	case KEYBIND.up:
		keys.up = true ^ keys.down;
		keys.left= false;
		keys.down = true ^ keys.up;
		keys.right = false;
		break;
	case KEYBIND.left:
		keys.up = false;
		keys.left= true ^ keys.right;
		keys.down = false;
		keys.right = true ^ keys.left;
		break;
	case KEYBIND.down:
		keys.down = true ^ keys.up;
		keys.up = true ^ keys.down;
		keys.left= false;
		keys.right = false;
		break;
	case KEYBIND.right:
		keys.up = false;
		keys.right = true ^ keys.left;
		keys.left= true ^ keys.right;
		keys.down = false;
		break;
	case KEYBIND.pause:
		paused = true ^ paused;
		break;
	case KEYBIND.start:
		if(lose) {
			initBoard();
			lose = false;
			dropNom();
		}
	default:
		break;
	}
}

function update() {
	if(lose) {
		//TODO: DISPLAY INSTRUCTIONS
		return;
	}
	if(paused) {
		//TODO: DISPLAY INSTRUCTIONS
		return;
	}
	var tail = {
		x:player.x,
		y:player.y
	};
	if (keys.up) {
		if(player.y - RADIUS >= VELOCITY) {
			player.y -= VELOCITY;
		}
		else {
			lose = true;
		}
	}
	if(keys.left) {
		if(player.x - RADIUS >= VELOCITY) {
			player.x -= VELOCITY;
		}
		else {
			lose = true;
		}
	}
	if(keys.down) {
			if(player.y + RADIUS <= canvas.height - VELOCITY) {
						player.y += VELOCITY;
			}
			else {
				lose = true;
			}
	}
	if(keys.right) {
		if(player.x + RADIUS <= canvas.width - VELOCITY) {
				player.x += VELOCITY;
		}
		else {
			lose = true;
		}
	}
	
	if(player.x >= nom.x - RADIUS && player.x <= nom.x + RADIUS && player.y >= nom.y - RADIUS && player.y <= nom.y + RADIUS) {
		dropNom();
		updateScore();
		addTail(player.x, player.y);
	}
	if(tails.length > 0 && !lose){
		var old = tails.pop();
		old.x = tail.x;
		old.y = tail.y;
		tails.splice(0,0,old);
	}
	checkTailCollision();
	

	draw();
}

function checkTailCollision() {
	for(var i = 0; i < tails.length; i++) {
		if(tails[i].x == player.x && tails[i].y == player.y) {
			lose = true;
			break;
		}
	}
}

function updateScore() {
	score.innerHTML++;
}
