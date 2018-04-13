var grid;
var lastView = {x:0,y:0,zoom:0,screen_width:0,screen_height:0};
const ENTITY_ZOOM_LEVEL = 750;
const CULL_BUFFER = 100;
//const COLONY_ZOOM_LEVEL;


function createSprite(container, x, y, width, height, type){
	var sprite = new PIXI.Sprite(PIXI.loader.resources[type].texture);
	sprite.position.set(worldToScreenX(x),worldToScreenY(y));
	sprite.width = worldToScreenScale(width);
	sprite.height = worldToScreenScale(height);
	container.addChild(sprite);
}

//Here we create all rendered objects if the camera moved
function updateWorldView(forceUpdate){

	//Check if player changed the camera
	if(!updateCamera() && !forceUpdate)
		return;

	if(camera.zoom < ENTITY_ZOOM_LEVEL){
		renderObjects();
	}

	else{
	}

	/*
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
	}*/

	//console.log(camera.x+" "+lastView.x+"\n"+camera.y+" "+lastView.y+"\n"+camera.screen_width+" "+lastView.screen_width+"\n"+camera.screen_height+" "+lastView.screen_height);
	updateHUD();
	//*********Fade image instead of sudden transition*************/
	//Scale image according to zoom level
	background.height = 851000000 / camera.zoom;
	background.width = 1702000000 / camera.zoom;
	background.alpha = camera.zoom < 25000 ? camera.zoom / 25000 : 1;
	background.position.set(worldToScreenX(0),worldToScreenY(0));

	lastView = {zoom: camera.zoom, x: camera.x, y: camera.y, screen_width: camera.screen_width, screen_height: camera.screen_height};
}

function removeContainer(container){
	if(container!=null){
		worldContainer.removeChild(container);
		container.destroy();
		container = null;
	}
}

/*function renderObjects(){
	var container = new PIXI.Container();

	createSprite(container,2,1,0.75,0.75,"astro");
	createSprite(container,5,7,1,1,"plant");
	createSprite(container,1,12,1,1,"plant");
	createSprite(container,1,3,0.75,0.75,"astro");
	createSprite(container,3,3,0.75,0.75,"astro");
	createSprite(container,2,4,3,3,"rover");
	createSprite(container,5,5,3,3,"water-tank");

	return container;
}*/

function createGrid(){
	var container = new PIXI.Container();

	let myGraph = new PIXI.Graphics();
	container.addChild(myGraph);

	//mygraph.alpha = 0.9;

	myGraph.position.set(0,0);

	//Colony unit sized grid
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

	/*
	//Meter sized grid
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
	}*/

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

	//console.log(startX+" "+startY);

	if(camera.dzoom == 1){
		camera.zoom *= 1.05
	}
	else if(camera.dzoom == -1){
		camera.zoom /= 1.05
	}
	else{
		camera.zoom += camera.dzoom * camera.zoom / 500;
		camera.dzoom /= 2;
	}

	if(camera.zoom > camera.max_zoom)
			camera.zoom = camera.max_zoom;
	if(camera.zoom < camera.min_zoom)
			camera.zoom = camera.min_zoom;

	if(Math.abs(camera.dzoom) < 1)
		camera.dzoom = 0;

	/*Math for zoom to cursor*/
	var zoomDifference = startZoom - camera.zoom;
	var mPoint = renderer.plugins.interaction.mouse.global;
	var xPercent = mPoint.x / window.innerWidth;
	var yPercent = mPoint.y / window.innerHeight;

	//camera.x += zoomDifference / camera.max_zoom * 1702000000 / 200; //200 because unit conversion and half zoom
	//camera.y += zoomDifference / camera.max_zoom * 851000000 / 200;

	camera.x += zoomDifference / camera.max_zoom * 1702000000 / 100 * xPercent;
	camera.y += zoomDifference / camera.max_zoom * 851000000 / 100 * yPercent;

	//console.log(window.innerWidth,window.innerHeight);

	if(camera.dx != 0){
		camera.x += camera.dx * camera.zoom / 10 * (camera.speedModifier?10:1);
	}

	if(camera.dy != 0){
		camera.y += camera.dy * camera.zoom / 10 * (camera.speedModifier?10:1);
	}

	camera.maxX = window.innerWidth * camera.max_zoom / 100 - (window.innerWidth * camera.zoom / 100);
	camera.maxY = window.innerHeight * camera.max_zoom / 100 - (window.innerHeight * camera.zoom / 100);

	if(camera.x < 0)
			camera.x = 0;
	if(camera.x > camera.maxX)
		camera.x = camera.maxX;

	if(camera.y < 0)
			camera.y = 0;
	if(camera.y > camera.maxY)		
		camera.y = camera.maxY;

	camera.screen_width = window.innerWidth * camera.zoom / 100;
	camera.screen_height = window.innerHeight * camera.zoom / 100;

	return true;
}

function drawColonyUnit(){
	let g = new PIXI.Graphics();
	g.fillAlpha = 0.5;

	var mPoint = renderer.plugins.interaction.mouse.global;

	var rX = Math.trunc(screenToWorldX(mPoint.x) / 5000)*5000;
	var rY = Math.trunc(screenToWorldY(mPoint.y) / 5000)*5000;

	//console.log(rX,rY);

	g.beginFill(0xFFD700,0.5);
	g.lineStyle(2,0xe5c100);
	g.drawRect(worldToScreenX(rX),worldToScreenY(rY),worldToScreenScale(5000),worldToScreenScale(5000));

	g.endFill();
	return g;
}

function preRender(){
	infoText.text = "Camera zoom: "+camera.zoom+"\nx: "+camera.x+"\ny: "+camera.y+"\nScreenWidth: "+window.innerWidth * camera.zoom / 100+"\nMaxX: "+camera.maxX;

	/*if(!colonyMade){
		var g = drawColonyUnit();
		worldContainer.addChild(g);
		return g;
	}*/

	return null;
}

function postRender(g){
	//worldContainer.removeChild(g);
}

function generateFeature(x,y){
	if(lastView.zoom < ENTITY_ZOOM_LEVEL){
		if(x > lastView.x - CULL_BUFFER && x < lastView.x + lastView.screen_width + CULL_BUFFER
			&& y > lastView.y - CULL_BUFFER && y < lastView.y + lastView.screen_height + CULL_BUFFER){
			return false;
		}
	}

	var rng = new Math.seedrandom(x+" "+y);
	var result = Math.floor(rng()*10000); 
	var sprite,w,h;

	if(result<9750)
		return false;

	else if(result<9990){
		sprite = new PIXI.Sprite(PIXI.loader.resources["rock-small"].texture);
		w = 10;
		h = 10;
	}
	else{
		sprite = new PIXI.Sprite(PIXI.loader.resources["mountain"].texture);
		w = 45;
		h = 45;
	}

	sprite.position.set(worldToScreenX(x),worldToScreenY(y));
	sprite.width = worldToScreenScale(w);
	sprite.height = worldToScreenScale(h);
	microContainer.addChild(sprite);
	microfeatures.push({x:x,y:y,w:w,h:h,sprite:sprite});
	return true;
}

function renderObjects(){
	//Microfeatures
	var d = 0;
	for(var i=camera.x - CULL_BUFFER;i<=camera.x+Math.floor(camera.screen_width)+CULL_BUFFER;i+=50){
		for(var j=camera.y - CULL_BUFFER;j<=camera.y+Math.floor(camera.screen_height)+CULL_BUFFER;j+=50){
			if(generateFeature(i,j))
				d++;
		}
	}

	console.log(d);
}

//Returns true if rendered, false if removed
function updateAndCullWorldObject(object, zoomCutoff){
	if(object.x > camera.x - CULL_BUFFER && object.x < window.innerWidth * camera.zoom/100+camera.x + CULL_BUFFER)
		if(object.y > camera.y - CULL_BUFFER && object.y < window.innerHeight * camera.zoom/100+camera.y + CULL_BUFFER)
			if(camera.zoom < zoomCutoff){
				object.sprite.x = worldToScreenX(object.x);
				object.sprite.y = worldToScreenY(object.y);
				object.sprite.width = worldToScreenScale(object.w);
				object.sprite.height = worldToScreenScale(object.h);
				return true;
			}
		
	return false;
}

function updateHUD(){
	for(var i = 0; i < textTags.length; i++){
		var textTag = textTags[i];
		textTag.sprite.x = worldToScreenX(textTag.x);
		textTag.sprite.y = worldToScreenY(textTag.y);
	}

	for(var i = 0; i < microfeatures.length; i++){
		var feature = microfeatures[i];
		if(!updateAndCullWorldObject(feature,ENTITY_ZOOM_LEVEL)){
			microContainer.removeChild(feature.sprite);
			microfeatures.splice(i,1);
		}
	}
}