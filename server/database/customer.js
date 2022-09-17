const validator = require('email-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Shoppingcarts } = require('./shoppingcart');

const Schema = mongoose.Schema;
const CustomerSchema = new Schema({
	shoppingcart: {type: Schema.Types.ObjectId, ref: 'Shoppingcarts'},
	firstname: {type: String, default: ''},
	lastname: {type: String, default: ''},
	email: {type: String, default: ''},
	street: {type: String, default: ''},
	town: {type: String, default: ''},
	zip: {type: String, default: ''},
	country: {type: String, default: 'Germany'},
	language: {type: String, default: 'de'},
	newsletter: {type: Boolean, default: false},
	accept: {type: Boolean, default: false},
	orders: {type: Number, default: 0},
	session: {type: String, default: ''},
	ip: {type: Array, select: false},
	useragent: {type: String, select: false},
	password: {type: String, select: false},
	registered: {type: Boolean, default: false},
	validation: {type: String, default: ''},
	validated: {type: Boolean, default: false},
	firstOrder: {type: Date, default: ''},
}, {
  timestamps: true
});
CustomerSchema.pre('save', async function(next) {
  if (this.isNew) {
		this.shoppingcart = await Shoppingcarts.create({
			customer: this,
			items: [],
		});
	} next();
});
CustomerSchema.pre('save', async function(next) {
	if (!this.isModified('email')) return next();
	if (validator.validate(this.email) == false) return next({
		type: 'email',
		text: 'This is not a valid Email adress',
	});
	let entry = await Users.findOne({
		email: this.email,
	});
	if (entry != null) return next({
		error: 'email',
		msg: 'This email adress is already in use',
	});
	return next();
});
CustomerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	return next();
});

CustomerSchema.methods.checkPw = async function(password) {
	if (!password) return false;
	let hashed = await Users.findById(this.get('_id'), 'password');
  return await bcrypt.compare(password, hashed.get('password'));
};

const Customers = mongoose.model('Customers', CustomerSchema);

module.exports = { Customers }
