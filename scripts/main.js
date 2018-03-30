let type = 'WebGL';
let stage;
let renderer;
let sprites = [];

const awsE = 'https://s3.us-east-2.amazonaws.com/hq.mars/Entities/';

function initialize() {
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

    /* Create stage*/
    stage = new PIXI.Container();

    renderer.view.style.position = 'absolute';
    renderer.view.style.display = 'block';
    renderer.autoResize = true;
    renderer.resize(window.innerWidth, window.innerHeight);

    renderer.backgroundColor = 0xFF8C00;

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

function loadImages() {
    PIXI.loader
        .add(`${awsE  }astronaut.png`)
        .add(`${awsE  }plant.png`)
        .add(`${awsE  }rover.png`)
        .add(`${awsE  }water-tank.png`)
        .load(setupWorld);
}

function setupWorld(){
	spriteContainer = populateWorld();
	stage.addChild(spriteContainer);

    gameLoop();
}

function gameLoop(){
	requestAnimationFrame(gameLoop);

	//PIXI.Matrix.translate(offsetVX,offsetVY);
	spriteContainer.x -= offsetVX * speedModifier;
	spriteContainer.y += offsetVY * speedModifier;
	
	if(zoom + zoomDelta > 2)
		zoom = 2;
	else if(zoom + zoomDelta < .05)
		zoom = .05;
	else
		zoom += zoomDelta;
	

	spriteContainer.scale.set(zoom);
	//spriteContainer.x = spriteContainer.x - zoomDelta*10;
	//spriteContainer.y = spriteContainer.y + zoomDelta*10;

	renderer.render(stage);

	/*const x = renderer.plugins.interaction.mouse.global.x;
	const y = renderer.plugins.interaction.mouse.global.y;

    if (Math.abs(sprites[0].x - x) <= 2 && Math.abs(sprites[0].y - y) <= 2) return;

    sprites[0].rotation = Math.atan2(y - sprites[0].y, x - sprites[0].x) + Math.PI;

	sprites[0].x -= Math.cos(sprites[0].rotation);
	sprites[0].y -= Math.sin(sprites[0].rotation);*/
}

initialize();
