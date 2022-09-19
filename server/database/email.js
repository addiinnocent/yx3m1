const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Logs } = require('./log');

const EmailSchema = new Schema({
	from: {type: String},
	to: {type: Array},
	subject: {type: String},
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
