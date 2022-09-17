const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Logs } = require('./log');

const EmailSchema = new Schema({
	title: {type: String, default: ''},
	text: {type: String, default: ''},
	from: {type: String, default: ''},
	to: {type: Array, default: []},
}, {
  timestamps: true
});
EmailSchema.pre('save', async function(next) {
  if (this.isNew) {
		await Logs.create({
			title: 'Email',
			text: 'Emails successfully sent to '+this.get('to').length+' recipients',
			type: 'email',
		})
  }
  next();
});

const Emails = mongoose.model('Emails', EmailSchema);

module.exports = { Emails }
