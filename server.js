var express = require('express');
var http = require('http');
var path = require('path');


var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//allows to put, patch, and delete http verbs
var methodOverride = require('method-override');
app.use(methodOverride('X-HTTP-Method-Override'));

//sets up a static file server that points to the client directory
app.use(express.static(path.join(__dirname, 'client')));

var mongoose = require('./config/mongoose.js')

//set port

var port = 3000

var server = app.listen((port), function(){
		console.log('Tacos be happening on port ----> ['+port+']');
	});


//set optional socket connection
var io = require('socket.io')(server);



var routes = require('./config/routes.js')(app,io);
