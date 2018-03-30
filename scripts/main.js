var type = "WebGL"
var stage;
var renderer;
var backgroundVisible = true;
var spriteContainer;
var labelContainer;
var HUDcontainer;
var worldContainer;
var background;
var grid;
var showGrid = false;
var highlightedCell;
var freezeCamera = false;
var colonyMade = false;
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



const awsE = 'https://s3.us-east-2.amazonaws.com/hq.mars/Entities/';

function initialize() {
	initApp();

    if (!PIXI.utils.isWebGLSupported()) {
        type = 'canvas';
    }

    /* This is PIXI JS Version*/
    PIXI.utils.sayHello(type);

    /* Create renderer*/
    renderer = PIXI.autoDetectRenderer(256, 256, {
        antialias: true,
        transparent: false,
        resolution: 1
    });

    /* Add canvas to HTML doc*/
    document.body.appendChild(renderer.view);

	/*Create stage*/
	stage = new PIXI.Container();
	stage.hitArea = new PIXI.Rectangle(0,0,1920,1080);
	stage.interactive = true;

	stage.mousedown = function (moveData){
		//console.log(moveData.data.global.x + " " + moveData.data.global.y);
		if(!colonyMade){
			setColony(moveData.data.global.x,moveData.data.global.y);
		}
	};

	worldContainer = new PIXI.Container();
	labelContainer = new PIXI.Container();
	HUDcontainer = new PIXI.Container();

	stage.addChild(worldContainer);
	stage.addChild(labelContainer);

	renderer.view.style.position = "absolute";
	renderer.view.style.display = "block";
	renderer.autoResize = true;
	renderer.resize(window.innerWidth, window.innerHeight);

	renderer.backgroundColor = 0xe77d11;

	//document.addEventListener("mousewheel",mouseWheelHandler, false);

	renderer.render(stage);

    /*
    Var sound = new Howl({
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
	worldContainer.addChild(background);

	//Initial camera setup
	var tempMaxWidth = 1702000000 / window.innerWidth;
	var tempMaxHeight = 851000000 / window.innerHeight;
	
	camera.max_zoom = tempMaxHeight > tempMaxWidth ? tempMaxWidth : tempMaxHeight;
	camera.zoom = camera.max_zoom;

	//camera.maxX = camera.maxX - tempMaxWidth;
	//camera.maxY = camera.maxY - tempMaxHeight;

	//console.log(tempMaxWidth);
	//console.log(tempMaxHeight);

	background.height = 851000000 / camera.zoom;
	background.width = 1702000000 / camera.zoom;
	//background.anchor.set(0.5,0.5);
	//background.position.set(background.width/2,background.height/2);

	createLabels();

	gameLoop();
}

function createLabels(){
	addTag("Olympus Mons",2206884,3365895);
	addTag("Valles Marineris",5004308,4647494);
	addTag("Alba Mons",3318364,2319287);
	addTag("Argyre Basin",6541268,6541268);
	addTag("Tempe Terra",4971447,2227977);
	addTag("Chryse Planitia",6884887,2481355);
	addTag("Arabia Terra",8868223,2691047);
	addTag("Noachis Terra",9470148,6909455);
	addTag("Hellas Basin",11666604,6192019);
	addTag("Isidis Basin",12704126,3642364);
	//addTag("Hesperia Planum",2206884,3365895);
	addTag("Elysium Mons",15507643,3046341);
	addTag("Utopia Basin",13463582,2619682);
}

function addTag(text,x,y){
	var testText = new PIXI.Text(text,
		{
			fontFamily:'Arial',
			fontSize:20,
			align:'center',
			fill:'#D3D3D3',
			stroke:'#151515',
			strokeThickness: 3
		});
	testText.x = worldToScreenX(x);
	testText.y = worldToScreenY(y);
	testText.anchor.set(0.5,0.5);
	labelContainer.addChild(testText);
}



function gameLoop(){
	requestAnimationFrame(gameLoop);

	var mPoint = renderer.plugins.interaction.mouse.global;

	updateWorldView(false);
	updateHUD();

	let g = new PIXI.Graphics();
	g.fillAlpha = 0.5;

	var rX = Math.trunc(screenToWorldX(mPoint.x) / 5000)*5000;
	var rY = Math.trunc(screenToWorldY(mPoint.y) / 5000)*5000;

	//console.log(rX,rY);

	g.beginFill(0xFFD700,0.5);
	g.lineStyle(2,0xe5c100);
	g.drawRect(worldToScreenX(rX),worldToScreenY(rY),worldToScreenScale(5000),worldToScreenScale(5000));

	g.endFill();
	worldContainer.addChild(g);

	//console.log(screenToWorldX(mPoint.x) / 5000 + " " + screenToWorldY(mPoint.y) / 5000 + " " + screenToWorldX(mPoint.x) + " " + screenToWorldY(mPoint.y));

	renderer.render(stage);

	worldContainer.removeChild(g);
	
}

function setColony(x,y){
	var user = firebase.auth().currentUser;
    var uid = user.uid;
    db.collection('users').doc(uid)
      .update({
		  colonyMade : true,
          "colony.x" : x,
          "colony.y" : y
      });

    colonyMade = true;
}

function getColonyCoord(){
    db.collection("users").get()
    .then(function(querySnapshot) {
      var colonies = [];
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          if(doc.data().colony != null)
            colonies.push(doc.data().colony);
        });
        console.log(colonies);;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}
initialize();
