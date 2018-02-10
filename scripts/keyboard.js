function initKeyboard(){
	offsetVX = 0;
    offsetVY = 0;
    zoomDelta = 0;
    zoom = 1;
    speedModifier = 1;

    let w = keyboard(87),
    a = keyboard(65),
    s = keyboard(83),
    d = keyboard(68),
    shift = keyboard(16),
    q = keyboard(81),
    e = keyboard(69);

    w.press = () => {
    	offsetVY += 5;
    };

    w.release = () => {
    	offsetVY -= 5;
    };

    a.press = () => {
    	offsetVX -= 5;
    };

    a.release = () => {
    	offsetVX += 5;
    };

    s.press = () => {
    	offsetVY -= 5;
    };

    s.release = () => {
    	offsetVY += 5;
    };

    d.press = () => {
    	offsetVX += 5;
    };

    d.release = () => {
    	offsetVX -= 5;
    };

    shift.press = () => {
    	speedModifier = 3;
    };

    shift.release = () => {
    	speedModifier = 1;
    }

    q.press = () => {
    	zoomDelta += .03;
    }

    q.release = () => {
    	zoomDelta -= .03;
    }

    e.press = () => {
    	zoomDelta -= .03;
    }

    e.release = () => {
    	zoomDelta += .03;
    }
}

function keyboard(keyCode){
	let key = {};
	key.code = keyCode;
	key.isDown = false;
	key.isUp = true;
	key.press = undefined;
	key.release = undefined;

	key.downHandler = event => {
		if(event.keyCode == key.code){
			if(key.isUp && key.press) key.press();
			key.isDown = true;
			key.isUp = false;
		}
		event.preventDefault();
	};

	key.upHandler = event => {
		if(event.keyCode === key.code){
			if(key.isDown && key.release) key.release();
			key.isDown = false;
			key.isUp = true;
		}
		event.preventDefault();
	};

	window.addEventListener("keydown",key.downHandler.bind(key), false);
	window.addEventListener("keyup", key.upHandler.bind(key),false);

	return key;
}
