const express = require('express');
const router = express.Router();

const { Coupons } = require('../database/coupon');
const { Shoppingcarts } = require('../database/shoppingcart');

router.post('/', async (req, res) => {
  try {
    let coupon = await Coupons.findOne({
      code: req.body.code,
      or: [
        { multiuse: true },
        { uses: 0 },
      ]
    })

    if (coupon) {
      let shoppingcart = await Shoppingcarts.findOne({
        customer: req.session.customer
      });
      await shoppingcart.set('coupon', coupon).save();

      res.json(coupon);
    } else res.sendStatus(400);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
