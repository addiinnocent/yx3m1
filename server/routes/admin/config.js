const express = require('express');
const router = express.Router();

const { Config } = require('../../database/config');

router.get('/', async (req, res) => {
  try {
    let config = await Config.findOne({});

    res.json(config)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/', async ({ body }, res) => {
  try {
    let config = await Config.findOne({});
    await config.set({...body}).save();

    res.json(config)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
