const express = require('express');
const router = express.Router();

const { Items } = require('../database/item');

router.get('/length/:category', async ({ params, query }, res) => {
  try {
    let length = await Items.countDocuments({
      ...params,
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

router.get('/:category', async ({ params, query }, res) => {
  try {
    let items = await Items.find({
      ...params,
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    }).populate('images')
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit((1+Number(query.pageIndex))*Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(items)
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
    }).populate('images')
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit((1+Number(query.pageIndex))*Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(items)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
