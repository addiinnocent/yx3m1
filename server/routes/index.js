const config = require('../database/config').config;
const { Customers } = require('../database/customer');

const adminRoutes = require('./admin');
const categoryRouter = require('./category');
const configRouter = require('./config');
const couponRouter = require('./coupon');
const customerRouter = require('./customer');
const itemRouter = require('./item');
const paypalRouter = require('./paypal');
const shoppingcartRouter = require('./shoppingcart');
const stripeRouter = require('./stripe');

const Routes = (app) => {
  adminRoutes(app);

  app.use('/', async (req, res, next) => {
    let { admin } = await config();
    if (admin.maintenance == true) {
      return res.end('we are currently in maintenance')
    }
    if (!req.session.customer) {
      let customer = await Customers.create({
        session: req.session.id,
      })
      req.session.customer = customer.get('_id');
    }
    next();
  });

  app.use('/api/category.json', categoryRouter);
  app.use('/api/config.json', configRouter);
  app.use('/api/coupon.json', couponRouter);
  app.use('/api/customer.json', customerRouter);
  app.use('/api/item.json', itemRouter);
  app.use('/api/paypal.json', paypalRouter);
  app.use('/api/shoppingcart.json', shoppingcartRouter);
  app.use('/api/stripe.json', stripeRouter);
}

module.exports = { Routes };
