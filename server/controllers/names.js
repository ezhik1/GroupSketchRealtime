var mongoose = require('mongoose');
var Name = mongoose.model('Name');

module.exports = (function(){
	return{
		show: function(req,res){
			console.log('pulling up names...');
			Name.find({}, function(err, results){
				if(err){
					console.log(err);
				}
				res.send(JSON.stringify(results));
			})
		},

		add: function(req,res){
			console.log('names sent to DB');
			var new_name = new Name(req.body);

			new_name.save(function(err){
				if(err){
					console.log(err);
				}
				else{
					res.send(JSON.stringify(new_name));
				}
			})
		},
		fetch: function(req,res){
			Name.findOne({name:req.params.id}).exec(function(err,user){
				if(user){
					console.log('found user: ', user);
					res.json(user);
				}else{
					console.log('mongo no find');
					res.json({error: 'not found'});
				}
			});
		},
		
		remove: function(req,res){
			

			Name.findOne({_id:req.params.id}).exec(function(err,data){
				if(data){
					console.log('removed entry--->',data);
					data.remove(function(err){
						if(err){
						console.log(err);
						res.send(400);
						}
						else{
							res.json(data);
						}
					})
				}
				else{
					res.send(400);
				}
			})
		} 
	}
})();