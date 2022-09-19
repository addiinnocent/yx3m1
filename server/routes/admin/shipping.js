const express = require('express');
const router = express.Router();
const csvtojson = require('csvtojson');
const { parseAsync } = require('json2csv');
const { Shippings } = require('../../database/shipping');

const fields = Object.keys(Shippings.schema.tree);
const opts = { fields };

router.get('/csv', async ({ query }, res) => {
  try {
    let shippings = await Shippings.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
    .skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    parseAsync(shippings, opts)
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
    let shippings = await Shippings.insertMany(json);

    res.json(shippings);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/length', async ({ query }, res) => {
  try {
    let length = await Shippings.countDocuments({
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
    let shippings = await Shippings.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(shippings)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/', async ({ body }, res) => {
  try {
    let shipping = await Shippings.create({
      ...body
    })
    res.json(shipping)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/:_id', async ({ params, body }, res) => {
  try {
    let shipping = await Shippings.findOne({
      _id: params._id,
    })
    await shipping.set({...body}).save();

    res.json(shipping)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/:_id', async ({ params }, res) => {
  try {
    let status = await Shippings.deleteOne({
      _id: params._id,
    })
    res.json(status)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});


module.exports = router;
