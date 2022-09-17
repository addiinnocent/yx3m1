const configRouter = require('./config');
const categoryRouter = require('./category');
const couponRouter = require('./coupon');
const customerRouter = require('./customer');
const logRouter = require('./log');
const loginRouter = require('./login');
const mailRouter = require('./mail');
const imageRouter = require('./image');
const itemRouter = require('./item');
const orderRouter = require('./order');
const paymentRouter = require('./payment');
const saleRouter = require('./sale');
const shippingRouter = require('./shipping');

var Routes = (app) => {
  app.use('/api/admin/login.json', loginRouter);
  app.use('/api/admin/logout.json', loginRouter);

  app.use('/api/admin', (req, res, next) => {
	  if (req.session.admin == true) next();
	  else res.end('no access');
	});

  app.use('/api/admin/config.json', configRouter);
  app.use('/api/admin/category.json', categoryRouter);
  app.use('/api/admin/coupon.json', couponRouter);
  app.use('/api/admin/customer.json', customerRouter);
  app.use('/api/admin/log.json', logRouter);
  app.use('/api/admin/mail.json', mailRouter);
  app.use('/api/admin/image.json', imageRouter);
  app.use('/api/admin/item.json', itemRouter);
  app.use('/api/admin/order.json', orderRouter);
  app.use('/api/admin/payment.json', paymentRouter);
  app.use('/api/admin/sale.json', saleRouter);
  app.use('/api/admin/shipping.json', shippingRouter);
}

module.exports = Routes;
