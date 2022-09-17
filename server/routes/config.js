const express = require('express');
const router = express.Router();

const { Config } = require('../database/config');

router.get('/countries', async (req, res) => {
  try {
    let config = await Config.findOne({

    }).select('countries');

    res.json(config.get('countries'));
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/payments', async (req, res) => {
  try {
    let config = await Config.findOne({

    }).select('stripe paypal');

    res.json({
      stripe: config.get('stripe').stripe_active,
      paypal: config.get('paypal').paypal_active,
    })
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});


module.exports = router;
