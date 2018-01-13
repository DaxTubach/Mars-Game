var express = require('express');
var path = require('path');
var app = express();

app.set('port',8080);

app.use(express.static(__dirname + '/public'));

app.get('/scripts/game_world.js',function(req,res){
	res.sendFile(path.join(__dirname+'/scripts/game_world.js'));
});

app.get('/scripts/howler.core.js',function(req,res){
	res.sendFile(path.join(__dirname+'/scripts/howler.core.js'));
});

app.get('/scripts/main.js',function(req,res){
	res.sendFile(path.join(__dirname+'/scripts/main.js'));
});

app.get('/scripts/pixi.min.js',function(req,res){
	res.sendFile(path.join(__dirname+'/scripts/pixi.min.js'));
});

app.post('/start',function(req,res){
	res.sendFile(path.join(__dirname+'/game.html'));
});

var server = app.listen(app.get('port'),function(){
	console.log('Server operational ' + server.address().port);
});