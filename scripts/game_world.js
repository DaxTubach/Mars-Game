function populateWorld(){
	var container = new PIXI.Container();

	createSprite(container,200,100,0.75,0.75,"astronaut.png");
	createSprite(container,50,75,1,1,"plant.png");
	createSprite(container,100,125,1,1,"plant.png");
	createSprite(container,100,300,0.75,0.75,"astronaut.png");
	createSprite(container,300,300,0.75,0.75,"astronaut.png");
	createSprite(container,250,400,5,5,"rover.png");
	createSprite(container,500,500,3,3,"water-tank.png");

	/*let myGraph = new PIXI.Graphics();
	container.addChild(myGraph);

	myGraph.position.set(0,0);

	for(i=0;i<5000;i++){
		myGraph.lineStyle(10,0xffffff).moveTo(0,i*100).lineTo(5000,i*100);		
	}

	for(j=0;j<5000,j++){
		myGraph.lineStyle(10,0xffffff).moveTo(j*100,0).lineTo(j*100,5000);		
	}*/

	container.pivot.set(container.width/2,container.height/2);

	return container;
}

function createSprite(container, x, y, width, height, type){
	var sprite = new PIXI.Sprite(PIXI.loader.resources[type].texture);
	sprite.position.set(worldToScreenX(x),worldToScreenY(y));
	sprite.width = worldToScreenScale(width);
	sprite.height = worldToScreenScale(height);
	//sprite.anchor.set(0.5,0.5);
	container.addChild(sprite);
}

//Here we create all rendered objects if the camera moved
function updateWorldView(forceUpdate){

	//Check if player changed the camera
	if(!updateCamera() && !forceUpdate)
		return;

	//Scale image according to zoom level
	background.height = camera.maxY / camera.zoom;
	background.width = camera.maxX / camera.zoom;
	background.position.set(worldToScreenX(0),worldToScreenY(0));
	background.pivot.set(.5,.5);

	if(camera.zoom < camera.max_zoom /10&&showGrid){
		removeContainer(grid);
		grid = createGrid();
		worldContainer.addChild(grid);
	}
	else if(grid != null){
		removeContainer(grid);
	}

	if(camera.zoom < 1500){
		worldContainer.removeChild(background);
		backgroundVisible = false;
	}
	else if(!backgroundVisible){
		worldContainer.addChildAt(background,0);
		backgroundVisible = true;
	}

	if(camera.zoom < 250){
		removeContainer(spriteContainer);
		spriteContainer = renderObjects();
		worldContainer.addChild(spriteContainer);
	}
	else if(spriteContainer != null){
		removeContainer(spriteContainer);
	}
	//var xAnchor = renderer.plugins.interaction.mouse.global.x;
	//var yAnchor = renderer.plugins.interaction.mouse.global.y;

	//console.log(xAnchor+" "+yAnchor);

	//background.anchor.set(); 
	//console.log("100px represents "+(camera.zoom*camera.zoom)+" meters squared or "+(camera.zoom/1000*camera.zoom/1000)+" kilometers squared.");
	//console.log(camera.x + " " + camera.y);
}

function removeContainer(container){
	if(container!=null){
		worldContainer.removeChild(container);
		container.destroy();
		container = null;
	}
}

function renderObjects(){
	var container = new PIXI.Container();

	createSprite(container,2,1,0.75,0.75,"astro");
	createSprite(container,5,7,1,1,"plant");
	createSprite(container,1,12,1,1,"plant");
	createSprite(container,1,3,0.75,0.75,"astro");
	createSprite(container,3,3,0.75,0.75,"astro");
	createSprite(container,2,4,3,3,"rover");
	createSprite(container,5,5,3,3,"water-tank");

	return container;
}

function createGrid(){
	var container = new PIXI.Container();

	let myGraph = new PIXI.Graphics();
	container.addChild(myGraph);

	//mygraph.alpha = 0.9;

	myGraph.position.set(0,0);

	for(i=0;i<1702;i++){
		myGraph.lineStyle(1,0xffffff)
		.moveTo(worldToScreenX(0),worldToScreenY(i*5000))
		.lineTo(worldToScreenX(3404*5000),worldToScreenY(i*5000));		
	}

	for(j=0;j<3404;j++){
		myGraph.lineStyle(1,0xffffff)
		.moveTo(worldToScreenX(j*5000),worldToScreenY(0))
		.lineTo(worldToScreenX(j*5000),worldToScreenY(1702*5000));		
	}

	if(camera.zoom < 100){
		for(i=0;i<5000;i++){
			myGraph.lineStyle(1,0x000000)
			.moveTo(worldToScreenX(0),worldToScreenY(i))
			.lineTo(worldToScreenX(5000),worldToScreenY(i));		
		}

		for(j=0;j<5000;j++){
			myGraph.lineStyle(1,0x000000)
			.moveTo(worldToScreenX(j),worldToScreenY(0))
			.lineTo(worldToScreenX(j),worldToScreenY(5000));		
		}
	}

	myGraph.lineStyle(10,0x000000).moveTo(0,0).lineTo(100000/camera.zoom,0);
	myGraph.lineStyle(10,0xff0000).moveTo(0,0).lineTo(100/camera.zoom,0);

	return container;
}

function screenToWorldX(x){

	return screenToWorldScale(x) + camera.x;// + camera.x;
}

function screenToWorldY(y){

	return screenToWorldScale(y) + camera.y;// + camera.y;
}

function screenToWorldScale(x){
	return x / 100 * camera.zoom;
}

function worldToScreenScale(x){
	return x * 100 / camera.zoom;
}

function worldToScreenY(y){

	return worldToScreenScale(y - camera.y);
}

function worldToScreenX(x){

	return worldToScreenScale(x - camera.x);
}

function updateCamera(){
	if(camera.dx == 0 && camera.dy == 0 && camera.dzoom == 0)
		return false;
	if(freezeCamera)
		return false;

	/*For zoom to cursor*/
	var startZoom = camera.zoom;

	if(camera.dzoom == 1){
		camera.zoom *= 1.05
		if(camera.zoom > camera.max_zoom)
			camera.zoom = camera.max_zoom;
	}
	if(camera.dzoom == -1){
		camera.zoom /= 1.05
		if(camera.zoom < camera.min_zoom)
			camera.zoom = camera.min_zoom;
	}
	
	/*Math for zoom to cursor*/
	var zoomDifference = startZoom - camera.zoom;
	//camera.x += zoomDifference*window.innerWidth / 100;
	//camera.y += zoomDifference*window.innerHeight / 100;

	//console.log(window.innerWidth,window.innerHeight);

	if(camera.dx != 0){
		camera.x += camera.dx * camera.zoom / 10; //+ camera.dx<0?-1:1;
	}

	if(camera.dy != 0){
		camera.y += camera.dy * camera.zoom / 10; //+ camera.dy<0?-1:1;
	}

	if(camera.x < 0)
			camera.x = 0;
	if(camera.x > camera.maxX)
		camera.x = camera.maxX;

	if(camera.y < 0)
			camera.y = 0;
	if(camera.y > camera.maxY)		
		camera.y = camera.maxY;

	return true;
}

function updateHUD(){
	labelContainer.removeChildren();
	createLabels();
}