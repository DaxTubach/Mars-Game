const express = require('express');
const path = require('path');
const app = express();
const portNum = 80;

app.set('port', portNum);

app.use(express.static(__dirname + '/public'));

app.get('/',(req,res) => {
    res.sendFile(path.join(`${__dirname}/public/login.html`));
});

app.get('/scripts/keyboard.js',(req,res) => {
    res.sendFile(path.join(`${__dirname}/scripts/keyboard.js`));
});

app.get('/scripts/game_world.js',(req,res) => {
    res.sendFile(path.join(`${__dirname}/scripts/game_world.js`));
});

app.get('/scripts/howler.core.js',(req,res) => {
    res.sendFile(path.join(`${__dirname}/scripts/howler.core.js`));
});

app.get('/scripts/main.js',(req,res) => {
    res.sendFile(path.join(`${__dirname}/scripts/main.js`));
});

app.get('/scripts/pixi.min.js',(req,res) => {
    res.sendFile(path.join(`${__dirname}/scripts/pixi.min.js`));
});

app.post('/start',(req,res) => {
    res.sendFile(path.join(`${__dirname}/game.html`));
});

const server = app.listen(app.get('port'),() => {
    console.log(`Server operational ${server.address().port}`);
});

/*
App.post('/start',(req,res) => {

    const idToken = req.headers.authorization.split('Bearer ')[1];

    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            const uid = decodedToken.uid;
            res.status(200).send('Looks good!')
            res.sendFile(path.join(`${__dirname}/game.html`));
        })
        .catch((error) => {
        // Handle error
            res.status(200).send('Looks bad!')
        });
});
*/
