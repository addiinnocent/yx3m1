const express = require('express');
const router = express.Router();

const { Customers } = require('../database/customer');

router.get('/', async (req, res) => {
  try {
    let customer = await Customers.findOne({
      _id: req.session.customer
    })

    res.json(customer);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/', async (req, res) => {
  try {
    let status = await Customers.updateOne({
      _id: req.session.customer
    }, {
      ...req.body,
    });

    res.json(status);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

/*router.put('/register', async (req, res) => {
  try {
    let user = await DB.get1({
      _id: req.session.user
    });
    user.set('firstname', req.body.firstname);
    user.set('lastname', req.body.lastname);
    user.set('email', req.body.email);
    user.set('street', req.body.street);
    user.set('zip', req.body.zip);
    user.set('town', req.body.town);
    user.set('dateofbirth', req.body.dateofbirth);
    user.set('newsletter', req.body.newsletter);
    user.set('registered', true);
    let mail = await createValidation(user);
    await sendEmail(mail);
    user.set('password', req.body.password);
    await user.save();
    user.set('password', '');
    req.session.regenerate(async (err) => {
      if (err) return res.sendStatus(500);
      res.json(user);
    });
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/login', async (req, res) => {
  try {
    let user = await DB.get1({
      email: req.body.email,
      registered: true,
    });
    if (!user)
		  throw({error: 'email', msg: 'The email does not exist'});
    if (await user.checkPw(req.body.password) == false)
      throw({error: 'password', msg: 'The password is not correct'});
    await user.set('session', req.sessionID).save();
    req.session.user = user._id;
    res.json(user);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/logout', async (req, res) => {
  try {
    req.session.regenerate(async function(err) {
      if (err) throw({error:'logout'});
      let user = await DB.new({
        session: req.sessionID,
      });
      req.session.user = user.get('_id');
      await Shoppingcarts.new({
        user: user.get('_id'),
      });
      res.json(req.session);
    })
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});*/

module.exports = router;
