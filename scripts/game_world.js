function populateWorld(){
	var container = new PIXI.Container();

	createSprite(container,200,100,0.5,0.5,"astronaut.png");
	createSprite(container,50,75,0.5,0.5,"plant.png");
	createSprite(container,100,125,1,1,"plant.png");
	createSprite(container,100,300,0.5,0.5,"astronaut.png");
	createSprite(container,300,300,0.5,0.5,"astronaut.png");
	createSprite(container,250,400,0.5,0.5,"rover.png");
	createSprite(container,500,500,0.5,0.5,"water-tank.png");

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

function createSprite(container, x, y, scaleX, scaleY, type){
	var sprite = new PIXI.Sprite(PIXI.loader.resources[awsE+type].texture);
	sprite.position.set(x,y);
	sprite.scale.set(scaleX,scaleY);
	sprite.anchor.set(0.5,0.5);
	container.addChild(sprite);
}