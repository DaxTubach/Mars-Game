var grid;
var lastView = {x:0,y:0,zoom:0,screen_width:0,screen_height:0};
var FIRST_GEN = []; //Used for initial feature generation
var CULL_BUFFER = [4,1500,15000];

const ENTITY_LARGE_ZOOM = 50000;
const ENTITY_MEDIUM_ZOOM =500;
const ENTITY_SMALL_ZOOM = 101;
const ENTITY_ZOOM = [150,5000,15000];
const ENTITY_SMALL = 0;
const ENTITY_MEDIUM = 1;
const ENTITY_LARGE = 2;
const CLOUD_ZOOM = 5000;
const ENTITY_ZOOM_LEVEL = 25000;

//const COLONY_ZOOM_LEVEL;

function createSprite(container, x, y, width, height, type) {
  var sprite = new PIXI.Sprite(PIXI.loader.resources[type].texture);
  sprite.position.set(worldToScreenX(x), worldToScreenY(y));
  sprite.width = worldToScreenScale(width);
  sprite.height = worldToScreenScale(height);
  container.addChild(sprite);
}

//Here we create all rendered objects if the camera moved
function updateWorldView(forceUpdate){

	//Check if player changed the camera
	if(!updateCamera() && !forceUpdate){
		updateClouds();
		return;
	}

	updateClouds();
	createMicrofeatures();
	updateHUD();

	//Scale image according to zoom level
	background.height = 851000000 / camera.zoom;
	background.width = 1702000000 / camera.zoom;
	background.alpha = camera.zoom < 25000 ? (camera.zoom / 50000)*2 : 1;

	if(background.alpha < .25)
		background.alpha = .25;

	background.position.set(worldToScreenX(0),worldToScreenY(0));

	  infoText.text =
	    'Camera zoom: ' +
	    camera.zoom +
	    '\nx: ' +
	    camera.x +
	    '\ny: ' +
	    camera.y +
	    '\nScreenWidth: ' +
	    window.innerWidth * camera.zoom / 100 +
	    '\nMaxX: ' +
	    camera.maxX;
	  lastView = {
	    zoom: camera.zoom,
	    x: camera.x,
	    y: camera.y,
	    screen_width: camera.screen_width,
	    screen_height: camera.screen_height,
	  };
}

function removeContainer(container) {
  if (container != null) {
    worldContainer.removeChild(container);
    container.destroy();
    container = null;
  }
}

function createGrid(){
	var container = new PIXI.Container();

  let myGraph = new PIXI.Graphics();
  container.addChild(myGraph);

  //mygraph.alpha = 0.9;

  myGraph.position.set(0, 0);

  //Colony unit sized grid
  for (i = 0; i < 1702; i++) {
    myGraph
      .lineStyle(1, 0xffffff)
      .moveTo(worldToScreenX(0), worldToScreenY(i * 5000))
      .lineTo(worldToScreenX(3404 * 5000), worldToScreenY(i * 5000));
  }

  for (j = 0; j < 3404; j++) {
    myGraph
      .lineStyle(1, 0xffffff)
      .moveTo(worldToScreenX(j * 5000), worldToScreenY(0))
      .lineTo(worldToScreenX(j * 5000), worldToScreenY(1702 * 5000));
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

  myGraph
    .lineStyle(10, 0x000000)
    .moveTo(0, 0)
    .lineTo(100000 / camera.zoom, 0);
  myGraph
    .lineStyle(10, 0xff0000)
    .moveTo(0, 0)
    .lineTo(100 / camera.zoom, 0);

  return container;
}

function screenToWorldX(x) {
  return screenToWorldScale(x) + camera.x; // + camera.x;
}

function screenToWorldY(y) {
  return screenToWorldScale(y) + camera.y; // + camera.y;
}

function screenToWorldScale(x) {
  return x / 100 * camera.zoom;
}

function worldToScreenScale(x) {
  return x * 100 / camera.zoom;
}

function worldToScreenY(y) {
  return worldToScreenScale(y - camera.y);
}

function worldToScreenX(x) {
  return worldToScreenScale(x - camera.x);
}

function updateCamera() {
  if (camera.dx == 0 && camera.dy == 0 && camera.dzoom == 0) {
    return false;
  }
  if (freezeCamera) return false;

  /*For zoom to cursor*/
  var startZoom = camera.zoom;

  //console.log(startX+" "+startY);

  if (camera.dzoom == 1) {
    camera.zoom *= 1.05;
  } else if (camera.dzoom == -1) {
    camera.zoom /= 1.05;
  } else {
    camera.zoom += camera.dzoom * camera.zoom / 500;
    camera.dzoom /= 2;
  }

  if (camera.zoom > camera.max_zoom) camera.zoom = camera.max_zoom;
  if (camera.zoom < camera.min_zoom) camera.zoom = camera.min_zoom;

  if (Math.abs(camera.dzoom) < 1) camera.dzoom = 0;

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

  if (camera.dx != 0) {
    camera.x += camera.dx * camera.zoom / 10 * (camera.speedModifier ? 10 : 1);
  }

  if (camera.dy != 0) {
    camera.y += camera.dy * camera.zoom / 10 * (camera.speedModifier ? 10 : 1);
  }

  camera.maxX = window.innerWidth * camera.max_zoom / 100 - window.innerWidth * camera.zoom / 100;
  camera.maxY = window.innerHeight * camera.max_zoom / 100 - window.innerHeight * camera.zoom / 100;

  if (camera.x < 0) camera.x = 0;
  if (camera.x > camera.maxX) camera.x = camera.maxX;

  if (camera.y < 0) camera.y = 0;
  if (camera.y > camera.maxY) camera.y = camera.maxY;

  camera.screen_width = window.innerWidth * camera.zoom / 100;
  camera.screen_height = window.innerHeight * camera.zoom / 100;

  return true;
}

function drawColonyUnit() {
  g = new PIXI.Graphics();

  if (!colonyMade) g.fillAlpha = 0.5;

  var mPoint = renderer.plugins.interaction.mouse.global;

  var rX = Math.trunc(screenToWorldX(mPoint.x) / 5000) * 5000;
  var rY = Math.trunc(screenToWorldY(mPoint.y) / 5000) * 5000;

  //console.log(rX,rY);

  g.beginFill(0xffd700, 0.5);
  g.lineStyle(2, 0xe5c100);
  g.drawRect(
    worldToScreenX(rX),
    worldToScreenY(rY),
    worldToScreenScale(5000),
    worldToScreenScale(5000),
  );

  g.endFill();
}

function drawEntityUnit() {
  g = new PIXI.Graphics();

  if (!colonyMade) g.fillAlpha = 0.5;

  var mPoint = renderer.plugins.interaction.mouse.global;

  var rX = Math.trunc(screenToWorldX(mPoint.x));
  var rY = Math.trunc(screenToWorldY(mPoint.y));

  //console.log(rX,rY);

  g.beginFill(0xffd700, 0.5);
  g.lineStyle(2, 0xe5c100);
  g.drawRect(worldToScreenX(rX), worldToScreenY(rY), worldToScreenScale(5), worldToScreenScale(5));

  g.endFill();
}

function preRender() {

  if (!colonyMade&&dialog==null) {
    drawColonyUnit();
    HUDcontainer.addChild(g);
  }
  if (settingEntity) {
    drawEntityUnit();
    HUDcontainer.addChild(g);
  }
}

function postRender() {
	if(dialog==null)
	  HUDcontainer.removeChild(g);
}

function generateSmall(x,y){
	var rng = new Math.seedrandom(x+" "+y);
	var result = Math.floor(rng()*10000); 
	var sprite,w,h;

	if(result<9750)
		return false;
	else{
		sprite = new PIXI.Sprite(PIXI.loader.resources["rock-small"].texture);
		w = Math.floor(rng()*4)+1;
		h = w;
	}

	sprite.alpha = 1;
	sprite.position.set(worldToScreenX(x),worldToScreenY(y));
	sprite.width = worldToScreenScale(w);
	sprite.height = worldToScreenScale(h);
	microContainer.addChild(sprite);
	microfeatures[ENTITY_SMALL].push({x:x,y:y,w:w,h:h,sprite:sprite});
}

function generateMedium(x,y){
	var rng = new Math.seedrandom(x+" "+y);
	var result = Math.floor(rng()*10000); 
	var sprite,w,h;

	if(result<99000)
		return false;
	else{
		sprite = new PIXI.Sprite(PIXI.loader.resources["mountain"].texture);
		w = Math.floor(rng()*500)+250;
		h = w;
	}

	sprite.alpha = 0.75;
	sprite.position.set(worldToScreenX(x),worldToScreenY(y));
	sprite.width = worldToScreenScale(w);
	sprite.height = worldToScreenScale(h);
	microContainer.addChild(sprite);
	microfeatures[ENTITY_MEDIUM].push({x:x,y:y,w:w,h:h,sprite:sprite});
}

function generateLarge(x,y){
	var rng = new Math.seedrandom(x+" "+y);
	var result = Math.floor(rng()*100000); 
	var sprite,w,h;

	if(result<99000)
		return false;
	else{
		sprite = new PIXI.Sprite(PIXI.loader.resources["mountain"].texture);
		w = Math.floor(rng()*10000)+500;
		h = w;
	}

	sprite.alpha = 0.5;
	sprite.position.set(worldToScreenX(x),worldToScreenY(y));
	sprite.width = worldToScreenScale(w);
	sprite.height = worldToScreenScale(h);
	microContainer.addChild(sprite);
	microfeatures[ENTITY_LARGE].push({x:x,y:y,w:w,h:h,sprite:sprite});
}

function generateFeature(x,y,size){
	//Make sure we don't generate in views we have already generated in
	if(FIRST_GEN[size] == false)
		if(x >= lastView.x && x <= lastView.x + lastView.screen_width
			&& y >= lastView.y && y <= lastView.y + lastView.screen_height){
			return false;
		}

	if(size==ENTITY_SMALL)
		generateSmall(x,y);
	else if(size==ENTITY_MEDIUM)
		generateMedium(x,y);
	else if(size==ENTITY_LARGE)
		generateLarge(x,y);
	else
		return false;

	return true;
}

function createMicrofeatures(){
	var d = 0;

	if(microfeatures[ENTITY_LARGE].length == 0)
		FIRST_GEN[ENTITY_LARGE] = true;
	else
		FIRST_GEN[ENTITY_LARGE] = false;

	/*
	if(camera.zoom < ENTITY_LARGE_ZOOM)
		for(var i=camera.x;i<camera.x+Math.floor(camera.screen_width);i+=25000){
			for(var j=camera.y;j<camera.y+Math.floor(camera.screen_height);j+=25000){
				if(generateFeature(i,j,ENTITY_LARGE))
					d++;
			}
		}

	if(microfeatures[ENTITY_MEDIUM].length == 0)
		FIRST_GEN[ENTITY_MEDIUM] = true;
	else
		FIRST_GEN[ENTITY_MEDIUM] = false;

	if(camera.zoom < ENTITY_MEDIUM_ZOOM)
		for(var i=camera.x;i<camera.x+Math.floor(camera.screen_width);i+=500){
			for(var j=camera.y;j<camera.y+Math.floor(camera.screen_height);j+=500){
				if(generateFeature(i,j,ENTITY_MEDIUM))
					d++;
			}
		}
	*/
	
	if(microfeatures[ENTITY_SMALL].length == 0)
		FIRST_GEN[ENTITY_SMALL] = true;
	else
		FIRST_GEN[ENTITY_SMALL] = false;

	if(camera.zoom < ENTITY_SMALL_ZOOM)
		for(var i=camera.x;i<camera.x+Math.floor(camera.screen_width);i+=4){
			for(var j=camera.y;j<camera.y+Math.floor(camera.screen_height);j+=4){
				if(generateFeature(i,j,ENTITY_SMALL))
					d++;
			}
		}

	console.log(d);
}

//Returns true if rendered, false if removed
function updateAndCullWorldObject(object, zoomCutoff,size){
	if(object.x > camera.x-CULL_BUFFER[size] && object.x <= camera.screen_width + camera.x)
		if(object.y > camera.y-CULL_BUFFER[size] && object.y <= camera.screen_height + camera.y)
			if(camera.zoom < zoomCutoff){
				object.sprite.x = worldToScreenX(object.x);
				object.sprite.y = worldToScreenY(object.y);
				object.sprite.width = worldToScreenScale(object.w);
				object.sprite.height = worldToScreenScale(object.h);
				return true;
			}
		
	return false;
}

function updateClouds(){

	if(camera.zoom < CLOUD_ZOOM)
		parallaxCloudContainer.alpha = 0;
	else
		parallaxCloudContainer.alpha = 0.17;

	for(var i = 0; i < clouds.length; i++){
		var cloud = clouds[i];
		var zoomDifference = lastView.zoom - camera.zoom;
		cloud.x += 250 + (lastView.x - camera.x)/cloud.zoomFactor;// - (zoomDifference / camera.max_zoom * 1702000000 / 100 * .5);
		cloud.y += 100 + (lastView.y - camera.y)/cloud.zoomFactor;// - (zoomDifference / camera.max_zoom * 851000000 / 100 * .5);

		if(cloud.x >= 17020000)
			cloud.x = -cloud.w;
		if(cloud.y >= 8510000)
			cloud.y = -cloud.h;

		cloud.sprite.x = worldToScreenX(cloud.x);
		cloud.sprite.y = worldToScreenY(cloud.y);
		cloud.sprite.width = worldToScreenScale(cloud.w);
		cloud.sprite.height = worldToScreenScale(cloud.h); 
	}
}

function updateHUD(){
	//Remove dialog if camera moved
	if(dialog!=null){
		HUDcontainer.removeChild(dialog.g);
		HUDcontainer.removeChild(dialog.text);
		dialog.text = null;
		for(i in dialog.buttons){
			HUDcontainer.removeChild(dialog.buttons[i]);
			dialog.buttons[i] = null;
		}
		dialog.g = null;
		dialog = null;
	}
	
	for(var i = 0; i < textTags.length; i++){
		var textTag = textTags[i];
		textTag.sprite.x = worldToScreenX(textTag.x);
		textTag.sprite.y = worldToScreenY(textTag.y);
	}
	
	for(var i = 0; i < entitylist.length; i++){
		var entity = entitylist[i];
		entity.sprite.x = worldToScreenX(entity.x);
		entity.sprite.y = worldToScreenY(entity.y);
		entity.sprite.width = worldToScreenScale(entity.w);
		entity.sprite.height = worldToScreenScale(entity.h);
	}
	
	for(var i = 0; i < microfeatures[ENTITY_SMALL].length; i++){
		var feature = microfeatures[ENTITY_SMALL][i];
		if(!updateAndCullWorldObject(feature,ENTITY_SMALL_ZOOM,ENTITY_SMALL)){
			microContainer.removeChild(feature.sprite);
			microfeatures[ENTITY_SMALL].splice(i,1);
		}
	}

	for(var i = 0; i < microfeatures[ENTITY_MEDIUM].length; i++){
		var feature = microfeatures[ENTITY_MEDIUM][i];
		if(!updateAndCullWorldObject(feature,ENTITY_MEDIUM_ZOOM,ENTITY_MEDIUM)){
			microContainer.removeChild(feature.sprite);
			microfeatures[ENTITY_MEDIUM].splice(i,1);
		}
	}

	for(var i = 0; i < microfeatures[ENTITY_LARGE].length; i++){
		var feature = microfeatures[ENTITY_LARGE][i];
		if(!updateAndCullWorldObject(feature,ENTITY_LARGE_ZOOM,ENTITY_LARGE)){
			microContainer.removeChild(feature.sprite);
			microfeatures[ENTITY_LARGE].splice(i,1);
		}
	}
}
