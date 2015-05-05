myApp.factory('NameFactory', function($http){

	var factory = {};
	var names = [];

	

	factory.getNames = function(callback){
		$http.get('/names_json').success(function (output){
			names = output;
			callback(names);
		});
	}

	factory.fetchName = function(name, callback){
		$http.get('/login/'+name).success(function (output){
			result = output;
			callback(result);
		});
	}
	factory.addName = function(info, callback){
		$http.post('/names_json',{name: info}).success(function (output){
			names.push(output);
			console.log('info factory', info)
			console.log('names object in factory', names)
			console.log('output from db-->', output)
			callback(names,output);
		});
	}
	factory.removeName = function(id,callback){
		console.log('this is the id-->',id)
		$http.delete('/remove_name/'+id).success(function (data){

			console.log(data)	
			for (x in names){
				if(names[x]._id==data._id){
					names.splice(x,1)
				}
			}
			callback(names,id);
		})
	}
	return factory;
});