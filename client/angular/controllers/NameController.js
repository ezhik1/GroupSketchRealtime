myApp.controller("NameController", function ($scope, $location, $rootScope, NameFactory, $routeParams){

	var socket = io();

	//Name list populates on refresh
	$scope.names = NameFactory.getNames(function(output){
		$scope.names = output;
		colorPattern();
	});

	//socket updates name list for users entering room	
	socket.on('welcome_user', function (data){
		
		$scope.names.push(data);

		colorPattern(); //returns color by index of user in the room

		$scope.$digest();
	})

	//socket updates name list for users leaving room
	socket.on('user_has_left', function (data){

		for (x in $scope.names){
			if($scope.names[x]._id==data){
				
				$scope.names.splice(x,1)
				$scope.$digest();
			}
		}
	})

	//user associated with curve being drawn
	socket.on('from_init',function (data){

		data.user = $scope.loggedInUser
		socket.emit('plus_curr', data)
		//console.log(data)
	})



	$scope.login = function() {

		if($scope.name != null){
			
			NameFactory.fetchName($scope.name, function(output){

				var user = null;
				$scope.results = output;
				if($scope.results.error)
				{
					$scope.addName(); //user not in database, so we add
				}else{

					//db call returns matching name
					if($scope.results.name === $scope.name && $scope.results !== undefined){
						$scope.setLocalStorage(); //user found
					}
				}
			})
		}
		else{
			console.log('user cannot be blank')
		}
    }

	$scope.logout = function(){

		localStorage.removeItem('user');
		localStorage.removeItem('userColor');
		$rootScope.loggedInUser = null;
		$rootScope.color = null;
		$location.path("/login");
		console.log('logout successful')
	}

	var setColor = function(index){ //colors: green, blue, black, red

		var default_color = ['#5EB953','#04A7CA','#515146','#C74929'];
		var result = null;

		//enough colors for four users
		result = default_color[index];
		return result;
	}

	var colorPattern = function(){ //color assignment logic

		var count = 0;
		//recyclable colors per user
		for (x in $scope.names){
			if(count < 4){
				$scope.names[x].color = setColor(count)
				count++;		
			}else{
				count = 0
				$scope.names[x].color = setColor(count)
				count++	
			}
		}
	}
	
	$scope.addName = function(){

		NameFactory.addName($scope.name, function(output, db_output){
			$scope.names = output;
			socket.emit('new_user_added', db_output);
			colorPattern();
			$scope.setLocalStorage();
		})
	};

	$scope.removeName = function(id){
		NameFactory.removeName(id,function(output, db_output){
			$scope.names = output;
			socket.emit('user_removed', db_output)
		})	
	};

	$scope.setLocalStorage = function(){
		localStorage.setItem('user', $scope.name);

		for (x in $scope.names){
			if ($scope.names[x].name == localStorage.getItem('user')){
				$scope.color =  $scope.names[x].color
			}	
		}
			
		localStorage.setItem('userColor', $scope.color)
		$location.path("/sketch");
	};

	$rootScope.loggedInUser = localStorage.getItem('user')
	$rootScope.color = localStorage.getItem('userColor')

	$scope.generateCanvas = function(color,line_width){

		$scope.change = {

			color : function(x){
				color = x
				return color
				},
			lineWidth : function(x){
				line_width = x
				return line_width
				}
			}

		// set up canvas
		var canvas = document.getElementById('myCanvas');
		var ctx = canvas.getContext('2d');

		//event listeners for curves
		canvas.addEventListener('mousedown', startDraw, false);
		canvas.addEventListener('mousemove', draw, false);
		canvas.addEventListener('mouseup', endDraw, false);

		function drawOnCanvas(color,line_width,plot){

			//line characteristics 
			ctx.strokeStyle = color;
			ctx.lineWidth = line_width;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.beginPath();

			//plot trace
			ctx.moveTo(plot[0].x,plot[0].y);
			
			for( var i=1; i<plot.length; i++){
				ctx.lineTo(plot[i].x, plot[i].y);
			}
			ctx.stroke();
		}

		//flag for status
		var isActive = false;

		//curve array
		var plot = [];

		function draw(e){
			if(!isActive)return;

			//position of mouse in canvas. Offsets for diff. browsers

			var x = e.offsetX || e.layerX - canvas.offsetLeft;
			var y = e.offsetY || e.layerY - canvas.offsetTop;

			//build plot for export
			plot.push({x: x, y: y});
			drawOnCanvas(color, line_width, plot);

			var socket_data = {color: color, line_width: line_width, plot: plot}

			//broadcast plot to other sockets
			socket.emit('hurrey',socket_data);
		}

		function startDraw(e){
			isActive = true;
		}

		function endDraw(e){
			isActive = false;

			// empty the array
			plot = [];
		}
		
		socket.on('curves', function (data){
			drawOnCanvas(data.color,data.line_width,data.plot)
		})
	}

	//canvas is generated once user is added or logged in
	if(localStorage.getItem('user') == $rootScope.loggedInUser && localStorage.getItem('user') != null){

		$scope.generateCanvas($rootScope.color,5);		
	}
});