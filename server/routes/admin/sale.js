var express = require('express');
var router = express.Router();
const csvtojson = require('csvtojson');
const { parseAsync } = require('json2csv');

const fields = ['_id', 'name', 'sold', 'total', 'customername', 'quantity', 'category', 'item', 'options', 'createdAt'];
const opts = { fields };

const {
  ShoppingcartItems
} = require('../../database/shoppingcart');

router.get('/graph', async ({ query }, res) => {
  try {
    let result = [];
    let sales = await ShoppingcartItems.find({
      sold: true,
      updatedAt: {
        $gte: new Date(query.startDate),
        $lte: new Date(query.endDate)
      }
    })
    .populate('item')
    .lean();

    for (let sale of sales) {
      let entry = result.find(e => e.item._id == sale.item._id);
      if (entry) {
        entry.value += sale.quantity*sale.item.price;
      } else {
        sale.value = sale.quantity*sale.item.price;
        result.push(sale);
      }
    }

    res.json(result)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/csv', async ({ query }, res) => {
  try {
    let sales = await ShoppingcartItems.find({
      sold: true,
      customername: {
        $regex: query.filter,
        $options: 'i'
      }
    })
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    parseAsync(sales, opts)
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
    let sales = await ShoppingcartItems.insertMany(json);

    res.json(sales);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/length', async ({ query }, res) => {
  try {
    let length = await ShoppingcartItems.countDocuments({
      sold: true,
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
    let sales = await ShoppingcartItems.find({
      sold: true,
      customername: {
        $regex: query.filter,
        $options: 'i'
      }
    })
    .populate('item')
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(sales)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/all', async ({ params }, res) => {
  try {
    let status = await ShoppingcartItems.deleteMany({
      sold: true,
    })

    res.json(status)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});



module.exports = router;
