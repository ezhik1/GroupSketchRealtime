var names = require('./../server/controllers/names.js')


module.exports = function(app, io){

	// RESTful routes
	app.get('/names_json', function (req,res){
		names.show(req,res);
		
	});
	app.get('/login/:id', function (req,res){
		names.fetch(req,res);
	});
	app.post('/names_json', function (req,res){
		names.add(req,res);
	});

	app.delete('/remove_name/:id', function (req,res){
		names.remove(req,res);
	})

	//Socket Connection

	 io.sockets.on('connection', function(socket){

		console.log('socket on!')
		socket.on('new_user_added', function(data){
			console.log('A new user has joined the room. Welcome, '+data.name);
			socket.broadcast.emit('welcome_user',data);
		})
		socket.on('user_removed', function(data){
			console.log('user id to remove-->', data)
			socket.broadcast.emit('user_has_left',data);
		})

		socket.on('hurrey', function(data){
			//console.log('things may work',data);
			socket.emit('from_init',data);
		})
		socket.on('plus_curr', function(data){
			socket.broadcast.emit('curves', data)
		})
	});
}