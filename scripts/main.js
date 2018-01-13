var type = "WebGL"
var stage;
var renderer;
var sprites = [];

let awsE = "https://s3.us-east-2.amazonaws.com/hq.mars/Entities/";


function initialize(){
	if(!PIXI.utils.isWebGLSupported()){
		type = "canvas";
	}

	/*This is PIXI JS Version*/
	PIXI.utils.sayHello(type);

	/*Create renderer*/
	renderer = PIXI.autoDetectRenderer(256, 256,{antialias:true, transparent: false, resolution: 1});

	/*Add canvas to HTML doc*/
	document.body.appendChild(renderer.view);

	/*Create stage*/
	stage = new PIXI.Container();

	renderer.view.style.position = "absolute";
	renderer.view.style.display = "block";
	renderer.autoResize = true;
	renderer.resize(window.innerWidth, window.innerHeight);

	renderer.backgroundColor = 0xFF8C00;

	renderer.render(stage);

	/*
    var sound = new Howl({
    	src:['music/Dust.mp3'],
		html5: true,
		loop: true
	});

    sound.play();*/

    loadImages();
}

function loadImages(){
	PIXI.loader
	.add(awsE+"astronaut.png")
	.add(awsE+"plant.png")
	.add(awsE+"rover.png")
	.add(awsE+"water-tank.png")
	.load(setupWorld);
}

function setupWorld(){
	var spriteArray = populateWorld();
	var arrayLength = spriteArray.length;

	sprites = spriteArray;

	for(var i=0; i<arrayLength;i++){
		stage.addChild(spriteArray[i]);
	}

	gameLoop();
}

function gameLoop(){
	requestAnimationFrame(gameLoop);
	renderer.render(stage);

	const x = renderer.plugins.interaction.mouse.global.x;
	const y = renderer.plugins.interaction.mouse.global.y;

	if(Math.abs(sprites[0].x-x) <= 2 && Math.abs(sprites[0].y-y) <= 2)
		return;

	sprites[0].rotation = Math.atan2(y - sprites[0].y, x - sprites[0].x) + Math.PI;

	sprites[0].x -= Math.cos(sprites[0].rotation);
	sprites[0].y -= Math.sin(sprites[0].rotation);
}

initialize();

