const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CategorySchema = new Schema({
	name: {type: String, default: ''},
	description: {type: String, default: ''},
	image: {type: Schema.Types.ObjectId, ref: 'Images'},
	parent: {type: Schema.Types.ObjectId, ref: 'Categories'},
	order: {type: Number, default: 0},
	active: {type: Boolean, default: true},
});
const Categories = mongoose.model('Categories', CategorySchema);

module.exports = { Categories }
