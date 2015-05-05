//require mongoose from node modules
var mongoose = require('mongoose');
//require file system to load and read all model files we create
var fs = require('fs');

var connect = function(){
	//specify options for mongoose when it to connects to mongoDB
	var options = { server: {socketOptions: {keepAlive: 1}}}
	mongoose.connect('mongodb://localhost/GroupSketch', options)
}

connect();

mongoose.connection.on('error', function(err){
	console.log(err);
})

mongoose.connection.on('disconnected', function(){
	connect();
})
var models_path = __dirname + '/../server/models'

//read all files. if file is javascript, require it
fs.readdirSync(models_path).forEach(function(file){
	if(~file.indexOf('.js')){
		require(models_path + '/' + file);
	}
})