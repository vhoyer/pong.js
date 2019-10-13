//initing vars
	//screen vars
var screen = document.body;

var canvas = document.getElementById("game");
canvas.width = 800 * 1.3;
canvas.height = 450 * 1.3;

var g = canvas.getContext("2d");
	//player vars
var Player = function(pos) {//{{{
	this.offset = 3; // offset from screen edge
	this.ySpeed = 3.4;
	this.up = 0; //going up/down/idle = 1/-1/0
	this.width = 10;
	this.height = 100;
	this.x = pos == 0 ? this.offset : canvas.width - this.width - this.offset;
	this.y = canvas.height/2 - this.height/2;

	this.fontSize = 35;
	this.xPoints = pos == 0 ? canvas.width/6 * 1 : canvas.width/6 * 4;
	this.yPoints = this.fontSize + this.offset;
	this.points = 0;

	this.move = function(dir){
		if (dir === "up")
			this.up = 1;
		else if (dir  === "down")
			this.up = -1;
		else
			this.up = 0;
	}

	this.update = function(){
		if (this.up === 1 && this.y + this.ySpeed > 0)
			this.y -= this.ySpeed;
		else if (this.up === -1 && this.y + this.height + this.ySpeed < canvas.height)
			this.y += this.ySpeed;
	}

	this.reset = function(){
		this.y = canvas.height/2 - this.height/2;
		this.up = 0;
	}

	this.point = function(){
		this.points++;
	}

	this.draw = function(){
		g.fillStyle='white';
		g.fillRect(this.x,this.y,this.width,this.height);

		g.font = this.fontSize + "px Arial";
		g.fillText(this.points,this.xPoints,this.yPoints);
	}
}//}}}
var Ball = function(){//{{{
	this.xSpeed = 6;
	this.ySpeed = 0;
	this.rad = 6;
	this.x = canvas.width/2;
	this.y = canvas.height/2;
	this.right = true;

	this.update = function(){
		this.y += this.ySpeed;
		if(this.y + this.rad <= 3 || this.y + this.rad >= canvas.height - 3)
			this.ySpeed *= -1;

		if (this.right){
			this.x += this.xSpeed;
		} else {
			this.x -= this.xSpeed;
		}

		if (this.x + this.rad > playerR.x && this.x + this.rad < playerR.x + playerR.width){
			if (this.collideWithPlayer(playerR)){
				this.right = false;
			} else {
				reset("left");
			}
		}
		if (this.x - this.rad > playerL.x && this.x - this.rad < playerL.x + playerL.width){
			if (this.collideWithPlayer(playerL)){
				this.right = true;
			} else {
				reset("right");
			}
		}
	}

	this.reset = function(){
		this.x = canvas.width/2;
		this.y = canvas.height/2;
		this.ySpeed = 0;
		this.right = !this.right;
	}

	this.collideWithPlayer = function(playerClass){
		if(this.y > playerClass.y && this.y < playerClass.y + playerClass.height){
			this.ySpeed = ( this.y - playerClass.y - playerClass.height/2 ) / 10;
			return true;
		}
		else
			return false;
	}

	this.draw = function(){
		g.fillStyle='white';
		g.beginPath();
		g.arc(this.x,this.y,this.rad, 0,2*Math.PI);
		g.fill();
	}
}//}}}

/////////////////////////////////////////////////////////////////////////

//setting vars
var playerL = new Player(0);
var playerR = new Player(1);
var ball = new Ball();

//setting backgroung
function drawBackground(){
	g.fillStyle='black';
	g.fillRect(0,0,canvas.width,canvas.height);
}

function reset(winner){
	ball.reset();
	playerL.reset();
	playerR.reset();

	if(winner == "left")
		playerL.point();
	else
		playerR.point();
}

function tick(){
	ball.update();
	playerL.update();
	playerR.update();
}
function draw(){
	//reset canvas
	drawBackground();

	playerL.draw();
	playerR.draw();
	ball.draw();
}

// Key listeners {{{
document.addEventListener('keydown', function(event) {
	if(event.keyCode == 38) { //up arrow
		playerR.move("up");
	}
	else if(event.keyCode == 40) { //down arrow
		playerR.move("down");
	}

	if(event.keyCode == 87) { //w
		playerL.move("up");
	}
	else if(event.keyCode == 83) { //s
		playerL.move("down");
	}
});
document.addEventListener('keyup', function(event) {
	if(event.keyCode == 38 || event.keyCode == 40) { //up arrow || down arrow
		playerR.move("none")
	}
	if(event.keyCode == 87 || event.keyCode == 83) { //w || s
		playerL.move("none");
	}
});//}}}

draw();
setInterval(function(){
	tick();
	draw();
},1000/60);