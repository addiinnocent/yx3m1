const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Logs } = require('./log');
const { Shippings } = require('./shipping');
const { orderEmail } = require('../bin/email');

const ShoppingcartItemSchema = new Schema({
  name: {type: String, default: ''},
  sold: {type: Boolean, default: false},
  total: {type: Number, default: false},
  customername: {type: String, default: ''},
  quantity: {
    type: Number,
    default: 1,
    min: [1, 'Quantity can not be less then 1.']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories',
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Items',
  },
  options: {},
}, {
    timestamps: true
});
ShoppingcartItemSchema.pre('save', async function(next) {
  if (this.isNew) {
    await this.populate('item');
    this.set('total', this.get('quantity')*this.get('item').price);
  }
  next();
});

const ShoppingcartSchema = new Schema({
  total: {type: Number, default: 0},
  length: {type: Number, default: 0},
  paid: {type: Boolean, default: false},
  finished: {type: Boolean, default: false},
  customername: {type: String, default: ''},
  paymentid: {type: String},
  additional: {type: Array},
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShoppingcartItems',
  }],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customers',
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payments',
    default: null,
  },
  shipping: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shippings',
    default: null,
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupons',
    default: null,
  },
}, {
  timestamps: true
});
ShoppingcartSchema.pre('save', async function(next) {
  if (this.isModified('paid')) {
    await this.populate('items customer payment shipping coupon');
    let customer = this.get('customer');
    let coupon = this.get('coupon');
    this.set('amount', this.get('items').length);
    this.set('customername', customer.get('firstname')+' '+customer.get('lastname'));

    for (let item of this.get('items')) {
      item.set('customername', this.get('customername'));
      item.set('sold', true);
      await item.save();
    }

    if (coupon) {
      coupon.set('uses', coupon.get('uses')+1);
      await coupon.save();
    }

    await customer.set('firstOrder', Date.now()).save();
    await orderEmail(this);
    await Logs.create({
      title: 'New Order',
      text: 'New order from '+this.get('customername'),
      data: this.toObject(),
      type: 'order',
    })
  }
  next();
});

ShoppingcartSchema.methods.calculate = async function() {
  let coupon = this.get('coupon');
  let total = 0;
  let weight = 0;
  let size = 0;

  for (let item of this.get('items')) {
    let shipping = item.item.shipping;
    weight += item.quantity*shipping.weight;
    size += (shipping.width*shipping.height*shipping.length)*item.quantity;
    total += item.quantity*item.item.price;
  }

  let shipping = await Shippings.findOne({
    weight: { $gte: weight || 0 },
    size: { $gte: size || 0 },
  }).sort('-weight -size')

  if (shipping) total += shipping.get('price');

  if (coupon) {
    if (coupon.type == 'discount') total -= coupon.value;
    if (coupon.type == 'percent') total -= total*(coupon.value/100);
  }

  this.set('shipping', shipping);
  this.set('total', Math.round(total*100)/100);
  await this.save();
}

const ShoppingcartItems = mongoose.model('ShoppingcartItems', ShoppingcartItemSchema);
const Shoppingcarts = mongoose.model('Shoppingcarts', ShoppingcartSchema);

module.exports = { ShoppingcartItems, Shoppingcarts };

/*const { Items } = require('./item');

(async () => {
  let shoppingcarts = await Shoppingcarts.find({
    paid: true,
  }).populate('items')
  for (let shoppingcart of shoppingcarts) {
    await shoppingcart.populate('customer');
    let customer = shoppingcart.customer;
    for (let item of shoppingcart.items) {
      if (customer) item.customername = customer.firstname+' '+customer.lastname;
      item.sold = true;
      let product = await Items.findOne({
        _id: item.item,
      })
      item.name = product.name;
      item.category = product.category;
      await ShoppingcartItems.create(item);
    }
    await shoppingcart.set('items', shoppingcart.items.map((e) => e._id)).save();
  }
  console.log('finished')
})()*/

/*(async () => {
  let items = await ShoppingcartItems.find({
  }).populate('item')
  for (let item of items) {
    await item.set('total', item.get('quantity')*item.get('item').price).save();
  }
  console.log('finished')
})()*/
