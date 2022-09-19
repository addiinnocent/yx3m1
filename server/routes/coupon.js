const express = require('express');
const router = express.Router();

const { Coupons } = require('../database/coupon');
const { Shoppingcarts } = require('../database/shoppingcart');

router.get('/redeem', async ({ query, session }, res) => {
  try {
    let coupon = await Coupons.findOne({
      code: query.code
    })

    if (coupon) {
      if (coupon.get('multiuse') || coupon.get('uses') < 1) {
        let shoppingcart = await Shoppingcarts.findOne({
          customer: req.session.customer
        }).sort({_id: -1})

        await shoppingcart.set('coupon', coupon).save();

        res.redirect('/shoppingcart');
      } else res.sendStatus(400);
    } else res.sendStatus(400);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/', async ({ body, session }, res) => {
  try {
    let coupon = await Coupons.findOne({
      code: req.body.code,
    })

    if (coupon) {
      if (coupon.get('multiuse') || coupon.get('uses') < 1) {
        let shoppingcart = await Shoppingcarts.findOne({
          customer: req.session.customer
        }).sort({_id: -1})

        await shoppingcart.set('coupon', coupon).save();

        res.json(coupon);
      } else res.sendStatus(400);
    } else res.sendStatus(400);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
