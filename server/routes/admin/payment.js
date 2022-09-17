const express = require('express');
const router = express.Router();
const csvtojson = require('csvtojson');
const { parseAsync } = require('json2csv');

const fields = ['_id', 'id', 'status', 'type', 'amount', 'customer', 'shoppingcart', 'createdAt'];
const opts = { fields };

const { Payments } = require('../../database/payment');

router.get('/graph', async ({ query }, res) => {
  try {
    let result = [];
    let payments = await Payments.find({
      createdAt: {
        $gte: new Date(query.startDate),
        $lt: new Date(query.endDate)
      }
    }).lean()

    for (let entry of Object.entries(payments.reduce((a, {type: key}) => (a[key] = (a[key] || 0) + 1, a), {}))) {
      result.push({
        name: entry[0],
        value: entry[1],
      })
    }

    res.json(result)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/csv', async ({ query }, res) => {
  try {
    let payments = await Payments.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    parseAsync(customers, opts)
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
    let customers = await Payments.insertMany(json);

    res.json(customers);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/length', async ({ query }, res) => {
  try {
    let length = await Payments.countDocuments({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
    res.json(length)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/', async ({ query }, res) => {
  try {
    let payments = await Payments.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(payments)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/', async ({ body }, res) => {
  try {
    let payment = await Payments.create({
      ...body
    })
    res.json(payment)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/:_id', async ({ params, body }, res) => {
  try {
    let payment = await Payments.findOneAndUpdate({
      _id: params._id,
    }, {
      ...body
    }, {
      new: true
    })
    res.json(payment)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/:_id', async ({ params }, res) => {
  try {
    let status = await Payments.deleteOne({
      _id: params._id,
    })
    res.json(status)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
