var express = require('express');
var router = express.Router();

const {
  Shoppingcarts,
  ShoppingcartItems
} = require('../database/shoppingcart');

router.get('/length', async (req, res) => {
  try {
    let shoppingcart = await Shoppingcarts.findOne({
      customer: req.session.customer,
    }).sort({_id: -1})
    .populate('items')

    res.json(shoppingcart.get('items').length)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/:_id', async ({params, session}, res) => {
  try {
    let shoppingcart = await Shoppingcarts.findOne({
      _id: params._id,
      customer: session.customer,
    })
    .populate('customer payment shipping coupon')
    .populate({
      path: 'items',
      populate: {
        path: 'item',
        populate: {
          path: 'images'
        }
      }
    })

    res.json(shoppingcart);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/', async (req, res) => {
  try {
    let shoppingcart = await Shoppingcarts.findOne({
      customer: req.session.customer,
    }).sort({_id: -1})
    .populate('customer coupon')
    .populate({
      path: 'items',
      populate: {
        path: 'item',
        populate: {
          path: 'images'
        }
      }
    })
    await shoppingcart.calculate();

    res.json(shoppingcart);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/', async (req, res) => {
  try {
    let shoppingcart = await Shoppingcarts.findOne({
      customer: req.session.customer,
    }).sort({_id: -1})
    .populate('items')

    if (!shoppingcart.items.find(e => String(e.item) == req.body.item._id)) {
      let item = await ShoppingcartItems.create({
        item: req.body.item,
        name: req.body.item.name,
        quantity: req.body.quantity,
        category: req.body.item.category,
        options: req.body.options,
      });
      shoppingcart.set('items', [...shoppingcart.items, item]);
      await shoppingcart.save();
    } else throw('This item is already in your shopping cart');

    res.json(shoppingcart);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/:_id', async ({ params, body }, res) => {
	try {
    let status = await ShoppingcartItems.updateOne({
      _id: params._id,
    }, {
      ...body,
    })

    res.json(status);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/:_id', async ({ params }, res) => {
  try {
    let status = await ShoppingcartItems.deleteOne({
      _id: params._id,
    })

    res.json(status);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
