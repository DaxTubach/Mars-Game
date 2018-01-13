function populateWorld(){
	var spriteArray = [];


	spriteArray.push(
		new PIXI.Sprite(PIXI.loader.resources[awsE+"astronaut.png"].texture)
	);

	spriteArray.push(
		new PIXI.Sprite(PIXI.loader.resources[awsE+"rover.png"].texture)
	);

	spriteArray[1].position.set(500,150);
	spriteArray[1].scale.set(0.5,0.5);
	spriteArray[1].anchor.set(0.5,0.5);

	spriteArray.push(
		new PIXI.Sprite(PIXI.loader.resources[awsE+"water-tank.png"].texture)
	);

	spriteArray[2].position.set(700,250);
	spriteArray[2].scale.set(0.5,0.5);
	spriteArray[2].anchor.set(0.5,0.5);

	spriteArray[0].position.set(50,50);
	spriteArray[0].scale.set(0.35,0.35);
	spriteArray[0].anchor.set(0.5,0.5);

	return spriteArray;
}