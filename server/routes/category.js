const express = require('express');
const router = express.Router();

const { Categories } = require('../database/category');

router.get('/length', async ({ query }, res) => {
  try {
    let length = await Categories.countDocuments({
      active: true,
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
      active: true,
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    }).populate('image')
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit((1+Number(query.pageIndex))*Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(categories)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
