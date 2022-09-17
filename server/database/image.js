const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ImageSchema = new Schema({
	name: {type: String, default: ''},
	src: {type: String, default: ''},
});

const Images = mongoose.model('Images', ImageSchema);

module.exports = { Images };
