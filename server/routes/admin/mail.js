const express = require('express');
const router = express.Router();
const csvtojson = require('csvtojson');
const { parseAsync } = require('json2csv');

const fields = ['_id', 'title', 'text', 'from', 'to'];
const opts = { fields };

const { Emails } = require('../../database/email');
const { newsletterEmail } = require('../../bin/email');

router.get('/csv', async ({ query }, res) => {
  try {
    let emails = await Emails.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
    .skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    parseAsync(emails, opts)
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
    let emails = await Emails.insertMany(json);

    res.json(emails);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/length', async ({ query }, res) => {
  try {
    let length = await Emails.countDocuments({
      title: {
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
    let emails = await Emails.find({
      title: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(emails)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/', async ({ body }, res) => {
  try {
    let mail = await newsletterEmail(body.title, body.text, body.to);
    let entry = await Emails.create({
      title: body.title,
      text: body.text,
      from: mail.from,
      to: mail.to,
    })

    res.json(entry);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
