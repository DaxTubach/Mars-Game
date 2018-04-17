
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
var freezeCamera = false;
var colonyMade = true;
var settingEntity = false;
var infoText;
var g; //Pixi graphics drawing
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

function initialize() {
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

  /*Create stage*/
  stage = new PIXI.Container();
  stage.hitArea = new PIXI.Rectangle(0, 0, window.innerWidth, window.innerHeight);
  stage.interactive = true;

  renderer.view.style.position = 'absolute';
  renderer.view.style.display = 'block';
  renderer.autoResize = true;
  renderer.resize(window.innerWidth, window.innerHeight);

  /* renderer.backgroundColor = 0xb74a0b; */
  renderer.backgroundColor = 0xcf644a; // I changed ya color Damian

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
    .add('water-tank', awsE + 'water-tank.png')
    .add('cloud', awsE + 'MartianCloud.png')
    .add('rock-small', awsE + 'rock-small.png')
    .add('mountain', awsE + 'mountain.png')
    .load(setupWorld);
}

function setEntity(id, x, y) {

  settingEntity = false;

  firebase.auth().onAuthStateChanged(user => {
    if (user) {

      if(userData.colony.entities == undefined)
          var entities = [];
      else
          entities = userData.colony.entities; 
      var entityData = {"id" : id, "x" : x, "y" : y};

      entities.push(entityData);

      const docRef = db.collection('users').doc(user.uid);
      docRef.update({
          'colony.entities' : entities,
      });
      loadEntities();
      console.log("Entity set at x : " + x + " y : " +y);
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

  createInteractions();
  generateClouds();

  gameLoop();
}

function loadEntities()
{
  if(camera.zoom < 500){
    var w = 30;
    var h = 30;
    var entities = userData.colony.entities;
    
    for (var i = 2; i < entities.length; i++) {
        console.log("Loading");
        console.log(entities[i]);
        var entity = new PIXI.Sprite(PIXI.loader.resources[entities[i].id].texture);
        entity.x = worldToScreenX(entities[i].x);
        entity.y = worldToScreenY(entities[i].y);
        entity.width = worldToScreenScale(30);
        entity.height = worldToScreenScale(30);
        entity.buttonMode = true;
        entity.interactive = true;
        entity.anchor.set(0.5, 0.5);
        entityContainer.addChild(entity);

        entity.mouseover = function(mouseData){
          this.alpha = 0.5;
        }

        entity.mouseout = function(entity){
          this.alpha = 1;
        }

        entity.mousedown = function(entity){
            
        }
        
        var entityObject = {
          sprite: entity,
          x: entities[i].x,
          y: entities[i].y,
          w: w,
          h: h,
        };
        entitylist.push(entityObject);
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
  getColonyCoord();
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
  db
    .collection('users')
    .get()
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
          if (doc.id == entity_name) {
            if (doc.data().info_text != null) {
              alert('found!');
              console.log(doc.id, ' => ', doc.data().info_text);
            }
          }
        });
        console.log(colonies);
        updateHUD();
      })
      .catch(function(error) {
        console.log('Error getting documents: ', error);
      });
  }
}

function createInteractions() {
  document.addEventListener('wheel', mouseWheelHandler, false);
  stage.mousedown = function(moveData) {
    var rX = Math.trunc(screenToWorldX(moveData.data.global.x) / 5000);
    var rY = Math.trunc(screenToWorldY(moveData.data.global.y) / 5000);
    var x = Math.trunc(screenToWorldX(moveData.data.global.x));
    var y = Math.trunc(screenToWorldY(moveData.data.global.y));
    //console.log(moveData.data.global.x + " " + moveData.data.global.y+" "+rX+" "+rY);
    if (!colonyMade) {
      setColony(rX, rY);
    }

    if(settingEntity)
    {
      setEntity("plant", x, y);
    }
  };

  /*Recenter*/
  var button = new PIXI.Sprite(PIXI.loader.resources['return-home'].texture);
  button.buttonMode = true;
  button.interactive = true;
  button.mousedown = function() {
    camera.zoom = 100;
    camera.x = userData.colony.x * 5000 + 2500 + window.innerWidth * camera.zoom / 100;
    camera.y = userData.colony.y * 5000 + 2500 + window.innerHeight * camera.zoom / 100;
    camera.screen_width = window.innerWidth * camera.zoom / 100;
    camera.screen_height = window.innerHeight * camera.zoom / 100;
    camera.maxX = window.innerWidth * camera.max_zoom / 100 - window.innerWidth * camera.zoom / 100;
    camera.maxY =
      window.innerHeight * camera.max_zoom / 100 - window.innerHeight * camera.zoom / 100;
    updateWorldView(true);
    loadEntities();
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
  HUDcontainer.addChild(signout)
  g = new PIXI.Graphics();


  /*Create Enitity*/
  var create = new PIXI.Sprite(PIXI.loader.resources['plant'].texture);
  create.buttonMode = true;
  create.interactive = true;
  create.mouseup = function(moveData) {
    console.log("Setting entity at next click location");
    settingEntity = true;
  };

  create.x = window.innerWidth * 0.85;
  create.y = window.innerHeight * 0.05;
  create.width = 50;
  create.height = 50;
  create.anchor.set(0.5);
  HUDcontainer.addChild(create);
  g = new PIXI.Graphics();

  /*Colonists*/
  var colonists = new PIXI.Sprite(PIXI.loader.resources['plant'].texture);
  colonists.buttonMode = true;
  colonists.interactive = true;
  colonists.mouseup = function(moveData) {

  };

  colonists.x = window.innerWidth * 0.03;
  colonists.y = window.innerHeight * 0.05;
  colonists.width = 50;
  colonists.height = 50;
  colonists.anchor.set(0.5);
  HUDcontainer.addChild(colonists);
  g = new PIXI.Graphics();

  /*Equipment*/
  var equipment = new PIXI.Sprite(PIXI.loader.resources['plant'].texture);
  equipment.buttonMode = true;
  equipment.interactive = true;
  equipment.mouseup = function(moveData) {
      
  };

  equipment.x = window.innerWidth * 0.03;
  equipment.y = window.innerHeight * 0.15;
  equipment.width = 50;
  equipment.height = 50;
  equipment.anchor.set(0.5);
  HUDcontainer.addChild(equipment);
  g = new PIXI.Graphics();

  /*Structures*/
  var structures = new PIXI.Sprite(PIXI.loader.resources['plant'].texture);
  structures.buttonMode = true;
  structures.interactive = true;
  structures.mouseup = function(moveData) {

  };

  structures.x = window.innerWidth * 0.03;
  structures.y = window.innerHeight * 0.25;
  structures.width = 50;
  structures.height = 50;
  structures.anchor.set(0.5);
  HUDcontainer.addChild(structures);
  g = new PIXI.Graphics();
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
