const express = require('express');
const router = express.Router();
const csvtojson = require('csvtojson');
const { parseAsync } = require('json2csv');

const fields = ['_id', 'name', 'description', 'category', 'images', 'tags', 'price', 'storage'];
const opts = { fields };

const { Items } = require('../../database/item');
const { Logs } = require('../../database/log');
const { ShoppingcartItems } = require('../../database/shoppingcart');

router.get('/graph', async ({ query }, res) => {
  try {
    let items = await Items.find({
      category: {
        $in: JSON.parse(query.categories)
      }
    }).lean()
    items = items.map((e) => {
      e.value = e.storage;
      return e;
    });

    res.json(items)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/csv', async ({ query }, res) => {
  try {
    let items = await Items.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
    .skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    parseAsync(items, opts)
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
    let items = await Items.insertMany(json);

    res.json(items);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/length', async ({ query }, res) => {
  try {
    let length = await Items.countDocuments({
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
    let items = await Items.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    }).populate('category images')
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(items)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/', async ({ body }, res) => {
  try {
    let item = await Items.create({
      ...body
    })
    await item.populate('category images')
    res.json(item)

    await Logs.create({
      title: 'Item created',
      text: item.get('name')+' item created successfully',
      type: 'item',
    })
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/:_id', async ({ params, body }, res) => {
  try {
    let item = await Items.findOneAndUpdate({
      _id: params._id,
    }, {
      ...body
    }, {
      new: true
    }).populate('category images')

    res.json(item)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/all', async ({ params }, res) => {
  try {
    let status = await Items.deleteMany({})
    await ShoppingcartItems.deleteMany({})

    res.json(status)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/:_id', async ({ params }, res) => {
  try {
    let status = await Items.deleteOne({
      _id: params._id,
    })
    await ShoppingcartItems.deleteMany({
      item: params._id,
    })

    res.json(status)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
