const express = require('express');
const router = express.Router();
const csvtojson = require('csvtojson');
const { parseAsync } = require('json2csv');

const fields = ['_id', 'name', 'code', 'link', 'type', 'value', 'multiuse', 'uses', 'createdAt'];
const opts = { fields };

const { Coupons } = require('../../database/coupon');
const { URL } = process.env;

router.get('/csv', async ({ query }, res) => {
  try {
    let coupons = await Coupons.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
    .skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    parseAsync(coupons, opts)
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
    let coupons = await Coupons.insertMany(json);

    res.json(coupons);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/length', async ({ query }, res) => {
  try {
    let length = await Coupons.countDocuments({
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
    let coupons = await Coupons.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(coupons)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/', async ({ body }, res) => {
  try {
    let coupon = await Coupons.create({
      ...body,
      link: URL+'/redeem?code='+body.code,
    })
    res.json(coupon)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/:_id', async ({ params, body }, res) => {
  try {
    let coupon = await Coupons.findOneAndUpdate({
      _id: params._id,
    }, {
      ...body,
      link: URL+'/redeem?code='+body.code,
    }, {
      new: true
    })
    res.json(coupon)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/:_id', async ({ params }, res) => {
  try {
    let status = await Coupons.deleteOne({
      _id: params._id,
    })
    console.log(status);
    res.json(status)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
