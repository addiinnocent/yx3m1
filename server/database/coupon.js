const mongoose = require('mongoose');
const { URL } = process.env;

var randomString = (length) => {
	var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var result = '';
	for (var i = 0; i < length; i++) {
		result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
	}
	return result;
}

const Schema = mongoose.Schema;
const CouponSchema = new Schema({
	name: {type: String, default: ''},
	code: {type: String, unique: true},
	link: {type: String, default: ''},
	type: {type: String, default: 'discount'},
	value: {type: Number, default: 0},
	multiuse: {type: Boolean, default: false},
	uses: {type: Number, default: 0},
}, {
	timestamps: true,
});
CouponSchema.pre('save', async function(next) {
  if (!this.code) {
		this.code = randomString(15);
	}
	next();
});
CouponSchema.pre('save', async function(next) {
  if (this.isModified('code')) {
		this.link = `${URL}/api/coupon.json/redeem?code=`+this.code;
		console.log(this.link);
	}
	next();
});

const Coupons = mongoose.model('Coupons', CouponSchema);

module.exports = { Coupons, randomString }
