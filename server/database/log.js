const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LogSchema = new Schema({
	title: {type: String, default: ''},
	text: {type: String, default: ''},
	type: {type: String, default: ''},
	data: {},
	checked: {type: Boolean, default: false},
}, {
  timestamps: true
});
const Logs = mongoose.model('Logs', LogSchema);

module.exports = { Logs }
