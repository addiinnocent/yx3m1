const express = require('express');
const router = express.Router();
const twofactor = require('node-2fa');

const config = require('../../database/config').config;
const { Logs } = require('../../database/log');

router.get('/', async (req, res) => {
  try {
    req.session.admin = false;
    res.json(true);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/', async ({ body, session }, res) => {
  try {
    let {
      admin_user,
      admin_pass,
      twofactor,
    } = await config();
    if (body.name == admin_user) {
      if (body.password == admin_pass) {
        if (!twofactor) {
          session.admin = true;
        }

        res.json(twofactor);
      } else throw('Wrong password');
    } else throw('Bad user credentials');
  } catch(e) {
    console.error(e);
    res.sendStatus(500);

    await Logs.create({
      title: 'Admin Login',
      text: e,
      type: 'login',
    })
  }
});

router.post('/2fa', async ({ body, session }, res) => {
  try {
    let { admin_secret } = await config();
    let result = twofactor.verifyToken(admin_secret, body.code);
    console.log(body);
    if (result == null) {
      throw('Bad Two Factor')
    } else if (result.delta == 0) {
      session.admin = true;

      res.json(true);
    }
  } catch(e) {
    console.error(e);
    res.sendStatus(500);

    await Logs.create({
      title: 'Admin Login',
      text: e,
      type: 'login',
    })
  }
});

module.exports = router;
