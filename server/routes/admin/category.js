const express = require('express');
const router = express.Router();
const csvtojson = require('csvtojson');
const { parseAsync } = require('json2csv');
const { Categories } = require('../../database/category');

const fields = Object.keys(Categories.schema.tree);
const opts = { fields };

router.get('/csv', async ({ query }, res) => {
  try {
    let categories = await Categories.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
    .skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    parseAsync(categories, opts)
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
    let categories = await Categories.insertMany(json);

    res.json(categories);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/length', async ({ query }, res) => {
  try {
    let length = await Categories.countDocuments({
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
    let categories = await Categories.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    }).populate('image')
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(categories)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/', async ({ body }, res) => {
  try {
    let category = await Categories.create({
      ...body
    })
    res.json(category)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/:_id', async ({ params, body }, res) => {
  try {
    let category = await Categories.findOneAndUpdate({
      _id: params._id,
    }, {
      ...body
    }, {
      new: true
    })
    res.json(category)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/:_id', async ({ params }, res) => {
  try {
    let status = await Categories.deleteOne({
      _id: params._id,
    })
    res.json(status)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});


module.exports = router;
