var express = require('express');
var router = express.Router();
var paypalSdk = require('@paypal/checkout-server-sdk');

const { CURRENCY } = process.env;
const config = require('../database/config').config;
const { Payments } = require('../database/payment');
const { Shoppingcarts, ShoppingcartItems } = require('../database/shoppingcart');


router.get('/create-paypal-transaction', async (req, res) => {
  try {
    let { paypal } = await config();
    var environment = new paypalSdk.core.SandboxEnvironment(paypal.paypal_client, paypal.paypal_secret);
    var client = new paypalSdk.core.PayPalHttpClient(environment);
    let request = new paypalSdk.orders.OrdersCreateRequest();
    let shoppingcart = await Shoppingcarts.findOne({
      customer: req.session.customer,
    }).sort({_id: -1})

    // 3. Call PayPal to set up a transaction
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: CURRENCY.toUpperCase(),
          value: shoppingcart.get('total').toFixed(2),
        }
      }],
      application_context: {
        shipping_preference: 'NO_SHIPPING'
      }
    });
    let response = await client.execute(request);
    await shoppingcart.set('paymentid', response.result.id).save();

    res.json(response.result);
  } catch(e) {
    console.error(e);
  }
});

router.post('/finish-paypal-transaction', async (req, res) => {
  try {
    let { paypal } = await config();
    var environment = new paypalSdk.core.SandboxEnvironment(paypal.paypal_client, paypal.paypal_secret);
    var client = new paypalSdk.core.PayPalHttpClient(environment);
    let request = new paypalSdk.orders.OrdersGetRequest(req.body.id);
    let response = await client.execute(request);

    let shoppingcart = await Shoppingcarts.findOne({
      paymentid: response.result.id,
    }).sort({_id: -1})
    .populate('customer')

    let payment = await Payments.create({
      ...response.result,
      type: 'paypal',
      amount: shoppingcart.get('total'),
      customer: shoppingcart.get('customer'),
      shoppingcart: shoppingcart,
    });

    if (response.result.status == 'COMPLETED') {
      shoppingcart.set('payment', payment);
      shoppingcart.set('paid', true);
      await shoppingcart.save();
      await Shoppingcarts.create({
        customer: req.session.customer,
      })

      res.json(shoppingcart.get('_id'));
    }
  } catch(e) {
    console.error(e);
  }
});

module.exports = router;
