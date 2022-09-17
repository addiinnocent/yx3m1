var express = require('express');
var router = express.Router();
const stripeSdk = require('stripe');

const { CURRENCY } = process.env;
const config = require('../database/config').config;
const { Customers } = require('../database/customer');
const { Payments } = require('../database/payment');
const { Shoppingcarts, ShoppingcartItems } = require('../database/shoppingcart');

var URL = 'http://localhost:4201';

router.post('/create-checkout-session', async (req, res) => {
  try {
    let { stripe } = await config();
    let Stripe = stripeSdk(stripe.stripe_secretkey);
    let customer = await Customers.findOne({
      _id: req.session.customer,
    })
    let shoppingcart = await Shoppingcarts.findOne({
      customer: req.session.customer,
    }).sort({_id: -1})
    .populate('shipping coupon')
    .populate({
      path: 'items',
      populate: {
        path: 'item',
      }
    })
    let coupon = await getCoupon(shoppingcart.get('coupon'));

    const session = await Stripe.checkout.sessions.create({
      payment_method_types: stripe.stripe_methods,
      customer_email: customer.get('email'),
      line_items: formatItems(shoppingcart.get('items')),
      shipping_options: formatShipping(shoppingcart.get('shipping')),
      discounts: [
        {coupon: coupon.id},
      ],
      mode: 'payment',
      success_url: URL+'/api/stripe.json/success?session={CHECKOUT_SESSION_ID}',
      cancel_url: URL+'/api/stripe.json/cancel?session={CHECKOUT_SESSION_ID}',
    });
    await shoppingcart.set('paymentid', session.payment_intent).save();

    res.json({ id: session.id });
  } catch(e) {
    console.error(e);
  }
});

router.get('/success', async (req, res) => {
  try {
    let { stripe } = await config();
    let Stripe = stripeSdk(stripe.stripe_secretkey);
    let session = await Stripe.checkout.sessions.retrieve(req.query.session);
    let payment_intent = await Stripe.paymentIntents.retrieve(session.payment_intent);

    let shoppingcart = await Shoppingcarts.findOne({
      paymentid: payment_intent.id,
    }).sort({_id: -1})
    .populate('customer')

    let payment = await Payments.create({
      ...payment_intent,
      type: 'stripe',
      amount: shoppingcart.get('total'),
      customer: shoppingcart.get('customer'),
      shoppingcart: shoppingcart,
    });

    if (payment_intent.status == 'succeeded') {
      shoppingcart.set('payment', payment);
      shoppingcart.set('paid', true);
      await shoppingcart.save();
      await Shoppingcarts.create({
        customer: req.session.customer,
      });

      res.redirect('/bill;id='+shoppingcart.get('_id'));
    }
  } catch(e) {
    console.error(e);
  }
});

router.get('/cancel', async (req, res) => {
  res.redirect('/summary');
});

var formatItems = (items) => {
  let result = [];
  for (let item of items) {
    result.push({
      price_data: {
        currency: CURRENCY,
        product_data: {
          name: item.item.name,
          metadata: {
            id: item.item._id,
          }
        },
        unit_amount: Math.round(item.item.price*100),
      },
      quantity: item.quantity,
    });
  }
  return result;
}

var formatShipping = (shipping) => {
  if (!shipping) return [];
  return [{
    shipping_rate_data: {
      type: 'fixed_amount',
      fixed_amount: {
        amount: shipping.get('price')*100,
        currency: CURRENCY,
      },
      display_name: shipping.get('name'),
    }
  }];
}

var getCoupon = async (coupon) => {
  let result = {};
  if (coupon) {
    if (coupon.type == 'discount') {
      result = await stripe.coupons.create({
        name: coupon.value,
        amount_off: coupon.value*100,
        currency: CURRENCY,
      });
    } else if (coupon.type == 'percent') {
      result = await stripe.coupons.create({
        name: coupon.value,
        percent_off: coupon.value,
      });
    }
  }
  return result;
}

module.exports = router;
