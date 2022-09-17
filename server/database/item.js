const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Shoppingcart } = require('./shoppingcart');

const ItemSchema = new Schema({
	name: {type: String, default: ''},
	description: {type: String, default: ''},
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Categories',
	},
	images: [{
		type: Schema.Types.ObjectId,
		ref: 'Images',
	}],
	tags: {type: Array, default: []},
	price: {type: Number, default: 0},
	tax: {type: Number, default: 0},
	storage: {type: Number, default: 0},
	shipping: {
		weight: {type: Number, default: 0},
		width: {type: Number, default: 0},
		height: {type: Number, default: 0},
		length: {type: Number, default: 0},
	},
	options: {

	},
});
const Items = mongoose.model('Items', ItemSchema);

module.exports = { Items };
