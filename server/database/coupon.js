const mongoose = require('mongoose');

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
const Coupons = mongoose.model('Coupons', CouponSchema);

//save value if type = percent value minmax 0-100

//coupon über link einlösen

module.exports = { Coupons }
