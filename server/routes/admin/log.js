const express = require('express');
const router = express.Router();
const { Logs } = require('../../database/log');

router.get('/', async ({ query }, res) => {
  try {
    let logs = await Logs.find({
      checked: false,
      type: {
        $in: JSON.parse(query.filter),
      }
    })
    .sort('-createdAt')
    .limit(5)

    res.json(logs)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/:_id', async ({ params, body }, res) => {
  try {
    let log = await Logs.findOneAndUpdate({
      _id: params._id,
    }, {
      ...body
    }, {
      new: true
    })
    res.json(log)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
