var type = "WebGL"
var stage;
var renderer;
var backgroundVisible = true;
var spriteContainer;
var HUDcontainer;
var worldContainer;
var background;
var grid;
var showGrid = false;
var camera = {
	x:0,
	y:0,
	maxX:1702000000,
	maxY:851000000,
	zoom:1, //Determines how many meters are visible in 100 px
	dx:0, //Change in X
	dy:0, //Change in Y
	dzoom:0, //Change in zoom
	speedModifier:false, //Scroll faster if toggled
	max_zoom: 100, //Dynamically set to be the size of Mars's surface in relation to the screen
	min_zoom: 1
};


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
	worldContainer = new PIXI.Container();
	HUDcontainer = new PIXI.Container();

	renderer.view.style.position = "absolute";
	renderer.view.style.display = "block";
	renderer.autoResize = true;
	renderer.resize(window.innerWidth, window.innerHeight);

	renderer.backgroundColor = 0xe77d11;

	//document.addEventListener("mousewheel",mouseWheelHandler, false);

	renderer.render(stage);

	/*
    var sound = new Howl({
    	src:['music/Dust.mp3'],
		html5: true,
		loop: true
	});

    sound.play();*/
    initKeyboard();
    //setupWorld();
    loadImages();
}

function loadImages(){
	PIXI.loader.add("Mars","MarsTex.png")
	.add("astro",awsE+"astronaut.png")
	.add("plant",awsE+"plant.png")
	.add("rover",awsE+"rover.png")
	.add("water-tank",awsE+"water-tank.png")
	.load(setupWorld);
}

function setupWorld(){
	//spriteContainer = populateWorld();
	//stage.addChild(spriteContainer);

	//Add background
	background = new PIXI.Sprite(PIXI.loader.resources["Mars"].texture);
	stage.addChild(background);

	//Initial camera setup
	var tempMaxWidth = 1702000000 / window.innerWidth;
	var tempMaxHeight = 851000000 / window.innerHeight;
	
	camera.max_zoom = tempMaxHeight > tempMaxWidth ? tempMaxWidth : tempMaxHeight;
	camera.zoom = camera.max_zoom;

	//camera.maxX = camera.maxX - tempMaxWidth;
	//camera.maxY = camera.maxY - tempMaxHeight;

	console.log(tempMaxWidth);
	console.log(tempMaxHeight);

	background.height = 851000000 / camera.zoom;
	background.width = 1702000000 / camera.zoom;
	//background.anchor.set(0.5,0.5);
	//background.position.set(background.width/2,background.height/2);

	gameLoop();
}



function gameLoop(){
	requestAnimationFrame(gameLoop);
	updateWorldView();

	var mPoint = renderer.plugins.interaction.mouse.global;

	console.log(screenToWorldX(mPoint.x) / 5000 + " " + screenToWorldY(mPoint.y) / 5000 + " " + screenToWorldX(mPoint.x) + " " + screenToWorldY(mPoint.y));

	renderer.render(stage);
}

initialize();

