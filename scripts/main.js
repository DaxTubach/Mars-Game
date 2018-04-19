
var type = 'WebGL';
var stage;
var renderer;
var backgroundVisible = true;
var spriteContainer,
  labelContainer,
  HUDcontainer,
  entityContainer,
  microContainer,
  parallaxCloudContainer;
var textTags = [],
  microfeatures = [],
  clouds = [],
  entitylist = [];
var background;
var colonies = [];
var userData;
var showGrid = false;
var highlightedCell;
var user;
var buildingID = null;
var freezeCamera = false;
var colonyMade = true;
var settingEntity = false;
var infoText;
var img;
var g; //Pixi graphics drawing
var dialog; //JSON for dialog drawing
var heightMap; //Grayscale image
var maxX = 17020000, maxY = 8510000;
var camera = {
  x: 0,
  y: 0,
  maxX: 1702000000,
  maxY: 851000000,
  zoom: 1, //Determines how many meters are visible in 100 px
  dx: 0, //Change in X
  dy: 0, //Change in Y
  dzoom: 0, //Change in zoom
  speedModifier: false, //Scroll faster if toggled
  max_zoom: 100, //Dynamically set to be the size of Mars's surface in relation to the screen
  min_zoom: 1,
  screen_width: 0, //Visible screen width in world units
  screen_height: 0,
};

const awsE = 'https://s3.us-east-2.amazonaws.com/hq.mars/Entities/';

function resize(){
	  stage.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);
	  renderer.resize(window.innerWidth, window.innerHeight);
}

function initialize() {
	var url = 'https://s3.us-east-2.amazonaws.com/hq.mars/Terrain/heightmap.jpg';
	img = new Image();
	img.src = url + '?' + new Date().getTime();
	img.setAttribute('crossOrigin', '');
	img.onload = function(){	
	  var canvas = document.createElement('canvas');
	  var context = canvas.getContext('2d');
	  canvas.width = img.naturalWidth;
	  canvas.height = img.naturalHeight;
	  context.drawImage(img,0,0);
	  heightMap = context.getImageData(0,0,img.naturalWidth,img.naturalHeight);
	}

  //img = new Image;
  //img.src = "https://s3.us-east-2.amazonaws.com/hq.mars/Terrain/heightmap.jpg";

  initApp();

  if (!PIXI.utils.isWebGLSupported()) {
    type = 'canvas';
  }

  /* This is PIXI JS Version*/
  PIXI.utils.sayHello(type);

  microContainer = new PIXI.Container();
  entityContainer = new PIXI.Container();
  parallaxCloudContainer = new PIXI.Container();
  labelContainer = new PIXI.Container();
  HUDcontainer = new PIXI.Container();

  HUDcontainer.interactive = true;

  getUser();
  getColonyCoord();

  /* Create renderer*/
  renderer = PIXI.autoDetectRenderer(256, 256, {
    antialias: true,
    transparent: false,
    resolution: 1,
  });

  /* Add canvas to HTML doc*/
  document.body.appendChild(renderer.view);
  //window.addEventListener("resize", resize);

  /*Create stage*/
  stage = new PIXI.Container();
  stage.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);
  stage.interactive = true;

  renderer.view.style.position = 'absolute';
  renderer.view.style.display = 'block';
  renderer.autoResize = true;
  renderer.resize(window.innerWidth, window.innerHeight);

  renderer.backgroundColor = 0xcf644a;

  //document.addEventListener("mousewheel",mouseWheelHandler, false);

  renderer.render(stage);

  var sound = new Howl({
    src: ['https://s3.us-east-2.amazonaws.com/hq.mars/Audio/Vortex+Mechanic+-+Plutonia.mp3'],
    html5: true,
    loop: true,
  });

  sound.play();
  initKeyboard();

  loadImages();

  //setEntity("id", 10, 10);
}

function loadImages() {
  PIXI.loader
    .add('return-home', 'images/return-home-icon.png')
    .add('logout', 'images/logout-icon.png')
    .add('Mars', awsE + 'MarsTex.png')
    .add('astro', awsE + 'astronaut.png')
    .add('plant', awsE + 'plant.png')
    .add('rover', awsE + 'rover.png')
    .add('water_tank', awsE + 'water-tank.png')
    .add('cloud', awsE + 'MartianCloud.png')
    .add('rock-small', awsE + 'rock-small.png')
    .add('mountain', awsE + 'mountain.png')
    .add('biodome', awsE + 'biodome.png')
    .add('building', awsE + 'building.png')
    .add('drill', awsE + 'drill.png')
    .add('med_bay', awsE + 'med-bay.png')
    .add('nuclear_generator', awsE + 'nuclear-generator.png')
    .add('research_lab', awsE + 'research-lab.png')
    .add('satellite_dish', awsE + 'satellite-dish.png')
    .add('solar_panel_array', awsE + 'solar-panel-array.png')
    .add('solar_panels', awsE + 'solar-panels.png')
    .load(setupWorld);
}

function setEntity(id, x, y) {
  settingEntity = false;
  var building = getBuildingInfo(id);

  var w = building.w;
  var h = building.h;
  console.log("WIdth" + w + " Height " +h)
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if (userData.colony.entities == undefined) var entities = [];
      else var entities = userData.colony.entities;
      var entityData = { id: id, x: x, y: y , w : w, h : h};

      entities.push(entityData);

      const docRef = db.collection('users').doc(user.uid);
      docRef.update({
        'colony.entities': entities,
      });

      userData.colony.entities = entities;
      loadEntity(entityData);

      console.log('Entity set at x : ' + x + ' y : ' + y);
    } else {
      console.log('boo');
    }
  });
}

function setupWorld() {
  //Add background
  background = new PIXI.Sprite(PIXI.loader.resources['Mars'].texture);
  stage.addChild(background);
  stage.addChild(microContainer);
  stage.addChild(entityContainer);
  stage.addChild(parallaxCloudContainer);
  stage.addChild(labelContainer);
  stage.addChild(HUDcontainer);
  infoText = new PIXI.Text('');
  infoText.x = 10;
  infoText.y = 10;
  HUDcontainer.addChild(infoText);

  //Initial camera setup
  var tempMaxWidth = 1702000000 / window.innerWidth;
  var tempMaxHeight = 851000000 / window.innerHeight;

  camera.max_zoom = tempMaxHeight > tempMaxWidth ? tempMaxWidth : tempMaxHeight;
  camera.zoom = camera.max_zoom;
  background.height = 851000000 / camera.zoom;
  background.width = 1702000000 / camera.zoom;
  createLabels();

  var small=[], medium=[], large=[];
  microfeatures.push(small);
  microfeatures.push(medium);
  microfeatures.push(large);
  //console.log(microfeatures);

  createInteractions();
  generateClouds();
  gameLoop();
}

function loadEntity(e) {
  
        console.log("Loading");
        console.log(e);
        var entity = new PIXI.Sprite(PIXI.loader.resources[e.id].texture);
        entity.x = worldToScreenX(e.x);
        entity.y = worldToScreenY(e.y);
        entity.width = worldToScreenScale(e.w);
        entity.height = worldToScreenScale(e.h);
    
        entity.anchor.set(0.5, 0.5);
        entityContainer.addChild(entity);

        entity.buttonMode = true;
        entity.interactive = true;

        var entityObject = {
          sprite: entity,
          x: e.x,
          y: e.y,
          w: e.w,
          h: e.h,
        };

        entitylist.push(entityObject);

        entity.mouseover = function()
        {
          this.alpha = 0.5;
        };

        entity.mouseout = function()
        {
          this.alpha = 1;
        };
}

function loadEntities() {
  if (camera.zoom < 500) {

    var entities = userData.colony.entities;
    
    for (var i = 0; i < entities.length; i++) {
        console.log("Loading");
        console.log(entities[i]);
        var entity = new PIXI.Sprite(PIXI.loader.resources[entities[i].id].texture);
        entity.x = worldToScreenX(entities[i].x);
        entity.y = worldToScreenY(entities[i].y);
        entity.width = worldToScreenScale(entities[i].w);
        entity.height = worldToScreenScale(entities[i].h);
    
        entity.anchor.set(0.5, 0.5);
        entityContainer.addChild(entity);

        entity.buttonMode = true;
        entity.interactive = true;

        var entityObject = {
          sprite: entity,
          x: entities[i].x,
          y: entities[i].y,
          w: entities[i].w,
          h: entities[i].h,
        };

        entitylist.push(entityObject);

        entity.mouseover = function()
        {
          this.alpha = 0.5;
        };

        entity.mouseout = function()
        {
          this.alpha = 1;
        };
        
   
    }
  }
}



function createLabels() {
  addLocationTag('Olympus Mons', 2206884, 3365895);
  addLocationTag('Valles Marineris', 5004308, 4647494);
  addLocationTag('Alba Mons', 3318364, 2319287);
  addLocationTag('Argyre Basin', 6541268, 6541268);
  addLocationTag('Tempe Terra', 4971447, 2227977);
  addLocationTag('Chryse Planitia', 6884887, 2481355);
  addLocationTag('Arabia Terra', 8868223, 2691047);
  addLocationTag('Noachis Terra', 9470148, 6909455);
  addLocationTag('Hellas Basin', 11666604, 6192019);
  addLocationTag('Isidis Basin', 12704126, 3642364);
  //addTag("Hesperia Planum",2206884,3365895);
  addLocationTag('Elysium Mons', 15507643, 3046341);
  addLocationTag('Utopia Basin', 13463582, 2619682);
}

function addLocationTag(text, x, y) {
  var testText = new PIXI.Text(text, {
    fontFamily: 'Arial',
    fontSize: 20,
    align: 'center',
    fill: '#D3D3D3',
    stroke: '#151515',
    strokeThickness: 3,
  });
  testText.x = worldToScreenX(x);
  testText.y = worldToScreenY(y);
  testText.anchor.set(0.5, 0.5);
  /*testText.interactive = true;
  testText.buttonMode = true;
  testText.mousedown = function(){
  	console.log("Pressed");
  	createDialog(testText.x,testText.y,testText,["Continue"],[]);
  }*/
  labelContainer.addChild(testText);
  var textObject = {
    sprite: testText,
    x: x,
    y: y,
  };
  textTags.push(textObject);
}

function addColonyTag(text, x, y) {
  var testText = new PIXI.Text(text, {
    fontFamily: 'Arial',
    fontSize: 18,
    align: 'center',
    fill: '#4B0082',
    stroke: '#9370DB',
    strokeThickness: 3,
  });
  testText.x = worldToScreenX(x);
  testText.y = worldToScreenY(y);
  testText.anchor.set(0.5, 0.5);
  labelContainer.addChild(testText);
  var textObject = {
    sprite: testText,
    x: x,
    y: y,
  };
  textTags.push(textObject);
}

/*General purpose dialogs*/
function createDialog(x,y,w,h,text,buttons,functions){
	updateHUD();
	var gDialog = new PIXI.Graphics();
	gDialog.fillAlpha = 0.5;

	gDialog.beginFill(0x164289,0.5);
	gDialog.lineStyle(2,0x000000);

	var drawnX = (x>innerWidth/2)?x-w:x;
	var drawnY = (y>innerHeight/2)?y-h:y;

	//Automatically adjust to make sure full dialog is visible
	gDialog.drawRect(drawnX,drawnY,w,h);
	gDialog.endFill();


	var text = new PIXI.Text(text,
		{wordWrap:true,
			wordWrapWidth:w,
			fontSize:14,
			fill:0xffffff,
			stroke:0x000000,
			strokeThickness:2});
	text.x = drawnX;
	text.y = drawnY;

	HUDcontainer.addChild(gDialog);
	HUDcontainer.addChild(text);

	if(buttons.length > 0){
		var yes = new PIXI.Text(buttons[0],{
			fontSize:20,
			fill:0x41a80a,
			stroke:0x266605,
			strokeThickness:3});
		yes.anchor.set(0.5,0.5);
		yes.buttonMode = true;
		yes.interactive = true;
		yes.mousedown = functions[0];
		yes.x = w/2 + drawnX;
		yes.y = h - h/6 + drawnY;

		/*
		var no = new PIXI.Text("No",{
			fontSize:20,
			fill:0xd81717,
			stroke:0x770404,
			strokeThickness:3});
		no.mousedown = func2;
		no.anchor.set(0.5,0.5);
		no.interactive = true;
		no.buttonMode = true;
		no.x = w*3/4 + drawnX;
		no.y = h - h/6 + drawnY;*/

		HUDcontainer.addChild(yes);
		//HUDcontainer.addChild(no);
		dialog = {g:gDialog,text:text,buttons:[yes]};
	}

	else{
		var ok = new PIXI.Text("");
	}
}

function createColonyDialog(x,y,rX,rY,originalX,originalY){
	if(heightMap==null)
		return;


	var percentX = x / maxX;
	var percentY = y / maxY;

	percentX = Math.floor(percentX * img.width);
	percentY = Math.floor(percentY * img.height);

	//Formula for converting x y into greyscale value
	//255 represents max height aka 15000ft (map is imperfect)
	var grayScale = heightMap.data[percentX*4 + percentY * img.width * 4];
	var topographicHeight = grayScale/255 * 25200 /*max height - minheight*/ - 8200; /*min height*/ 
	var sunlight = rY < 851 ? Math.round(rY / 70) : Math.round((1702 - rY) / 70); //Distance max 12 from equator
	var pressure = 1 - (grayScale / 255) * .1631/*max press - min*/ + .0044/*min pressure*/;
	var temperature = rY < 851 ? rY / 851 * 170 + 123 : (1702 - rY) / 851/*percent distance from equator*/ * 170/*dif max min*/ + 123/*min*/;

	var text = "Height: "+Math.round(topographicHeight)+" meters"+
	"\nPressure: "+Math.round(pressure*10000)/10000+" PSI"+
	"\nSunlight: "+sunlight+" hours"+
	"\nTemperature: "+Math.round(temperature)+" kelvin";

	createDialog(originalX,originalY,250,125,text,["Place Colony"],[function(){return setColony(rX,rY)}]);
	//console.log(heightMap.data[percentX*4 + percentY * img.width * 4]);

	
	//var height = heightMap.data[percentY * img.height + percentX];
}

function createEntityDialog(x,y,originalX,originalY,id)
{
  createDialog(originalX,originalY,250,125,"",["Place Building"],[function(){return setEntity(id,x,y)}]);

}

function setColony(x, y) {
  var user = firebase.auth().currentUser;
  var uid = user.uid;
  db
    .collection('users')
    .doc(uid)
    .update({
      colonyMade: true,
      'colony.x': x,
      'colony.y': y,
    });
  colonyMade = true;
  getUser();
  getColonyCoord(()=>recenter());
}

function getUser() {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      const docRef = db.collection('users').doc(user.uid);
      docRef
        .get()
        .then(doc => {
          if (doc.exists) {
            //Do Stuff here
            colonyMade = doc.data().colonyMade;
            // Can push it to the global variable but it won't be available right away.
            userData = doc.data();
            // Kinda works, wont have data right away.
            console.log('CCC', userData);
          } else {
            // Doc.data() will be undefined in this case
            console.log('No such document!');
          }
        })
        .catch(error => {
          console.log('Error getting document:', error);
        });
    } else {
      console.log('Not logged in... somehow');
    }
  });
}

function getColonyCoord() {
  colonies = [];
  db.collection('users').get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().colony != null) colonies.push(doc.data().colony);
      });
      console.log(colonies);

      for (i in colonies) {
        if (colonies[i].x != null && colonies[i].y != null) {
          addColonyTag(colonies[i].Name, colonies[i].x * 5000 + 2500, colonies[i].y * 5000 + 2500);
          updateHUD();
        }
      }
    })
    .catch(function(error) {
      console.log('Error getting documents: ', error);
    });
}

// 1 = equipment, 2 = landmark, 3 - structures
// testing: getEntityInfo(2, "olympus_mons")
// prints data to console but dont know how to return as string form,
// currently returning as [object, object]
function getEntityInfo(collection_type, entity_name) {
  var skipFlag = 0;

  var collection_name;
  if (collection_type == 1) {
    collection_name = 'equipment_info';
  } else if (collection_type == 2) {
    collection_name = 'landmark_info';
  } else if (collection_type == 3) {
    collection_name = 'structures_info';
  } else {
    var skipFlag = 1;
  }

  if (skipFlag == 0) {
    db
      .collection(collection_name)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          if (doc.name == entity_name) {
            if (doc.data().info_text != null) {
              alert('found!');
              console.log(doc.id, ' => ', doc.data().info_text);
              return doc.data().info_text;
            }
          }
        });
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  }

  return null;
}

function recenter(){
	camera.zoom = 100;
    camera.x = userData.colony.x * 5000 + 2500 - window.innerWidth * camera.zoom / 200;
    camera.y = userData.colony.y * 5000 + 2500 - window.innerHeight * camera.zoom / 200;
    camera.screen_width = window.innerWidth * camera.zoom / 100;
    camera.screen_height = window.innerHeight * camera.zoom / 100;
    camera.maxX = window.innerWidth * camera.max_zoom / 100 - window.innerWidth * camera.zoom / 100;
    camera.maxY =
      window.innerHeight * camera.max_zoom / 100 - window.innerHeight * camera.zoom / 100;
    updateWorldView(true);
    loadEntities();
}

function createInteractions() {
  document.addEventListener('wheel', mouseWheelHandler, false);
  stage.mousedown = function(moveData) {
    var rX = Math.trunc(screenToWorldX(moveData.data.global.x) / 5000);
    var rY = Math.trunc(screenToWorldY(moveData.data.global.y) / 5000);
    var x = Math.trunc(screenToWorldX(moveData.data.global.x));
    var y = Math.trunc(screenToWorldY(moveData.data.global.y));
    //console.log(moveData.data.global.x + " " + moveData.data.global.y+" "+rX+" "+rY);

    if(dialog!=null){
    	updateHUD();
    	return;
    }

    if (!colonyMade) {
      createColonyDialog(x,y,rX,rY,moveData.data.global.x,moveData.data.global.y);
    }

    else if (settingEntity) {
      createEntityDialog(x,y,moveData.data.global.x,moveData.data.global.y, buildingID);
    }
  };

  /*Recenter*/
  var button = new PIXI.Sprite(PIXI.loader.resources['return-home'].texture);
  button.buttonMode = true;
  button.interactive = true;
  button.mousedown = function() {
    recenter();
  };

  button.x = window.innerWidth * 0.9;
  button.y = window.innerHeight * 0.05;
  button.width = 50;
  button.height = 50;
  button.anchor.set(0.5);
  HUDcontainer.addChild(button);

  /*Signout*/
  var signout = new PIXI.Sprite(PIXI.loader.resources['logout'].texture);
  signout.buttonMode = true;
  signout.interactive = true;
  signout.mousedown = function() {
    signOut();
  };

  signout.x = window.innerWidth * 0.95;
  signout.y = window.innerHeight * 0.05;
  signout.width = 50;
  signout.height = 50;
  signout.anchor.set(0.5);
  HUDcontainer.addChild(signout);
  g = new PIXI.Graphics();

  /*Create Enitity*//*
  var create = new PIXI.Sprite(PIXI.loader.resources['plant'].texture);
  create.buttonMode = true;
  create.interactive = true;
  create.mouseup = function(moveData) {
    console.log('Setting entity at next click location');
    settingEntity = true;
  };

  create.x = window.innerWidth * 0.85;
  create.y = window.innerHeight * 0.05;
  create.width = 50;
  create.height = 50;
  create.anchor.set(0.5);
  HUDcontainer.addChild(create);
*/
}

function mouseWheelHandler(e) {
  camera.dzoom = Math.sign(e.deltaY) * 50;
}

function generateClouds() {
  for (var i = 0; i < 1000; i++) {
    var cloud = new PIXI.Sprite(PIXI.loader.resources['cloud'].texture);
    var x = Math.floor(Math.random() * 17020000);
    var y = Math.floor(Math.random() * 8510000);
    var w = Math.floor(Math.random() * 500000) + 10000;
    var h = w * 1.25;
    var zoomFactor = Math.floor(Math.random() * 10) + 2;
    cloud.x = worldToScreenX(x);
    cloud.y = worldToScreenY(y);
    cloud.rotation = Math.floor(Math.random() * 180) * 0.0174533; //Degrees to radians
    parallaxCloudContainer.addChild(cloud);
    clouds.push({ sprite: cloud, x: x, y: y, w: w, h: h, zoomFactor: zoomFactor });
  }
}

function equipmentClick(id)
{
	console.log(id);
	
}

function buildingClick(id)
{
	console.log(id);
	var hasReqs = true;
	var equipment = userData.colony.equipment;
	var building = getBuildingInfo(id);
 // console.log(JSON.stringify(buildingArray));
//	console.log(building);
	
//	for(var i = 0; i < building.pre_reqs.length; i++)
	//	if(equipment[building.pre_reqs[i]] == 0)
   //   hasReqs = false;
      
	if(hasReqs)
	{
    buildingID = id;
    settingEntity = true;
    console.log("Has");
	}
  else
  {
		console.log("No Has");
  }
}

function getBuildingInfo(id)
{
//	console.log(JSON.stringify(buildingArray));

	for(var i = 0; i < buildingArray.length; i++)
	{
		console.log(buildingArray[i]);
		if(buildingArray[i].id == id)
		{
			//console.log("found " + buildingArray[i].id);
			return buildingArray[i];
		}
	}
}

function dilemas() {
  var structures = userData.colony.entities;

  // Dust storm

  // Radiation Posioning

  // Psyche Break

  // Equipment degraded (Need safe storage)

  // Random Structure Breakdown

  // Nuclear generator Failure

  // Found Mineral Deposit (Extra Money!)
}

function gameLoop() {
  requestAnimationFrame(gameLoop);

  updateWorldView(false);

  preRender();
  renderer.render(stage);
  postRender();
}

initialize();
