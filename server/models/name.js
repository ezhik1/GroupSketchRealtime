var mongoose = require('mongoose');

var NameSchema = new mongoose.Schema({
	name: String,
	created_at: {type: Date, 'default': Date.now}
})

mongoose.model('Name', NameSchema);