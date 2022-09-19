var express = require('express');
var router = express.Router();
const csvtojson = require('csvtojson');
const { parseAsync } = require('json2csv');
const { Shoppingcarts } = require('../../database/shoppingcart');

const fields = Object.keys(Shoppingcarts.schema.tree);
const opts = { fields, includeEmptyRows: false };

router.get('/graph', async ({ query }, res) => {
  try {
    let items = [];
    let shoppingcarts = await Shoppingcarts.find({
      paid: true,
      updatedAt: {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate)
      }
    }).lean()

    for (let shoppingcart of shoppingcarts) {
    }

    res.json(shoppingcarts)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/csv', async ({ query }, res) => {
  try {
    let orders = await Shoppingcarts.find({
      paid: true,
      customername: {
        $regex: query.filter,
        $options: 'i'
      }
    })
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    parseAsync(orders, opts)
    .then(async csv => {
      res.json(csv)
    })
    .catch(err => {
      throw(err);
    });
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/csv', async ({ body }, res) => {
  try {
    let json = await csvtojson({
      checkType: true,
      ignoreEmpty: true,
    }).fromString(body.data)
    let orders = await Shoppingcarts.insertMany(json);

    res.json(orders);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/length', async ({ query }, res) => {
  try {
    let length = await Shoppingcarts.countDocuments({
      paid: true,
      customername: {
        $regex: query.filter,
        $options: 'i'
      }
    })

    res.json(length)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/', async ({ query }, res) => {
  try {
    let orders = await Shoppingcarts.find({
      paid: true,
      customername: {
        $regex: query.filter,
        $options: 'i'
      }
    })
    .populate('items customer payment shipping coupon')
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(orders)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/:_id', async ({ params, body }, res) => {
  try {
    let order = await Shoppingcarts.findOneAndUpdate({
      _id: params._id,
    }, {
      finished: body.finished,
    }, {
      new: true
    }).populate('items customer payment shipping coupon')

    res.json(order);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/all', async ({ params }, res) => {
  try {
    let status = await Shoppingcarts.deleteMany({
      paid: true,
    })

    res.json(status)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});


module.exports = router;
