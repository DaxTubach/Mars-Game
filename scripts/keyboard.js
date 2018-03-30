function initKeyboard(){

    let w = keyboard(87),
    a = keyboard(65),
    s = keyboard(83),
    d = keyboard(68),
    shift = keyboard(16),
    q = keyboard(81),
    e = keyboard(69);
    g = keyboard(71);

    w.press = () => {
    	camera.dy = -1;
    };

    w.release = () => {
    	camera.dy = 0;
    };

    a.press = () => {
    	camera.dx = -1;
    };

    a.release = () => {
    	camera.dx = 0;
    };

    s.press = () => {
    	camera.dy = 1;
    };

    s.release = () => {
    	camera.dy = 0;
    };

    d.press = () => {
    	camera.dx = 1;
    };

    d.release = () => {
    	camera.dx = 0;
    };

    shift.press = () => {
    	camera.speedModifier = true;
    };

    shift.release = () => {
    	camera.speedModifier = false;
    }

    q.press = () => {
    	camera.dzoom = 1;
    }

    q.release = () => {
    	camera.dzoom = 0;
    }

    e.press = () => {
    	camera.dzoom = -1;
    }

    e.release = () => {
    	camera.dzoom = 0;
    }

    g.press = () => {
        showGrid = !showGrid;
        updateWorldView(true);
    }

    g.release = () => {

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
