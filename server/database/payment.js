const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PaymentSchema = new Schema({
  id: String,
  status: String,
  type: String,
  amount: Number,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
  },
  shoppingcart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shoppingcart',
  },
}, {
    timestamps: true
});
const Payments = mongoose.model('Payments', PaymentSchema);

module.exports = { Payments };
