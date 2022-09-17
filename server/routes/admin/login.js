const express = require('express');
const router = express.Router();

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

router.post('/', async (req, res) => {
  try {
    let { body } = req;
    let { admin } = await config();
    if (body.name == admin.admin_user) {
      if (body.password == admin.admin_pass) {
        req.session.admin = true;
        res.json(true);
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

module.exports = router;
