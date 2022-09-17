const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ShippingSchema = new Schema({
	name: {type: String, default: ''},
	price: {type: Number, default: 0},
	weight: {type: Number, default: 0},
	width: {type: Number, default: 0},
	height: {type: Number, default: 0},
	length: {type: Number, default: 0},
	size: {type: Number, default: 0},
	destinations: {type: Array, default: []}
});
ShippingSchema.pre('save', async function(next) {
  if (this.isModified('width') || this.isModified('height') || this.isModified('length')) {
    this.set('size', (this.width*this.height*this.length));
  }
  next();
});
const Shippings = mongoose.model('Shippings', ShippingSchema);

module.exports = { Shippings };
