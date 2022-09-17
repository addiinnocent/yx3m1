var express = require('express');
var router = express.Router();

var Logs = require('../../database/log');

router.get('/', function(req, res) {
  res.render('dashboard_ger/index');
});

router.post('/login', async function(req, res, next) {
  let {dashboard_user, dashboard_pass} = require('../bin/config').dashboard
  let error;
	if (req.body.user != dashboard_user) error = {
    type: 'dashboard_login',
    message: 'invalid Login Name',
  }
  if (req.body.pass != dashboard_pass) error = {
    type: 'dashboard_login',
    message: 'invalid Login Password',
  }
  if (error) {
    Logs.new(error);
    res.sendStatus(406);
  } else {
    req.session.regenerate(function(err) {
      if (err) return Logs.new(err);
      req.session.admin = true;
      res.json(true);
    });
  }
});

router.post('/logout', async function(req, res) {
  req.session.regenerate(function(err) {
    if (err) return Logs.new(err);
    res.end();
  });
});

module.exports = router;
