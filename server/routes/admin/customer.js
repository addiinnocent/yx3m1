const express = require('express');
const router = express.Router();
const csvtojson = require('csvtojson');
const { parseAsync } = require('json2csv');
const { Customers } = require('../../database/customer');

const fields = Object.keys(Customers.schema.tree);
const opts = { fields };



router.get('/graph', async ({ query }, res) => {
  try {
    res.json([
      {
        name: 'Customers',
        series: await uniqueVisitors(query),
      }, {
        name: 'First Orders',
        series: await firstOrders(query),
      }
    ])
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/newsletter', async ({ query }, res) => {
  try {
    let emails = await Customers.find({
      newsletter: true,
    }).select('email')
    emails = emails.map((e) => e.email);

    res.json(emails)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/csv', async ({ query }, res) => {
  try {
    let customers = await Customers.find({
      accept: true,
      $or: [{
          firstname: {
      	   $regex: query.filter,
           $options: 'i'
      	  }
        }, {
          lastname: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          email: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          street: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          zip: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          town: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }
      ]
    })
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    parseAsync(customers, opts)
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
    let customers = await Customers.insertMany(json);

    res.json(customers);
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/length', async ({ query }, res) => {
  try {
    let length = await Customers.countDocuments({
      accept: true,
      $or: [{
          firstname: {
      	   $regex: query.filter,
           $options: 'i'
      	  }
        }, {
          lastname: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          email: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          street: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          zip: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          town: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }
      ]
    })

    res.json(length)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.get('/', async ({ query }, res) => {
  try {
    let customers = await Customers.find({
      accept: true,
      $or: [{
          firstname: {
      	   $regex: query.filter,
           $options: 'i'
      	  }
        }, {
          lastname: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          email: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          street: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          zip: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }, {
          town: {
        	   $regex: query.filter,
             $options: 'i'
        	}
        }
      ]
    })
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit(Number(query.pageSize))
    .sort({[query.sortActive]: query.sortDirection})

    res.json(customers)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/:_id', async ({ params, body }, res) => {
  try {
    let customer = await Customers.findOneAndUpdate({
      _id: params._id,
    }, {
      ...body,
    }, {
      new: true
    })

    res.json(customer)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/all', async ({ params }, res) => {
  try {
    let status = await Customers.deleteMany({})

    res.json(status)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

let uniqueVisitors = async (query) => {
  let dates = [];
  let customers = await Customers.find({
    createdAt: {
      $gte: new Date(query.startDate),
      $lte: new Date(query.endDate)
    }
  })
  .select('createdAt')
  .lean()

  for (let customer of customers) {
    let date = new Date(customer.createdAt).setHours(0,0,0,0);
    let entry = dates.find(e => e.name == date);
    if (entry) {
      entry.value++;
    } else {
      dates.push({
        name: date,
        value: 1,
      });
    }
  }
  return dates;
}

let firstOrders = async (query) => {
  let dates = [];
  let customers = await Customers.find({
    firstOrder: {
      $gte: new Date(query.startDate),
      $lte: new Date(query.endDate)
    }
  })
  .select('firstOrder')
  .lean()

  for (let customer of customers) {
    let date = new Date(customer.firstOrder).setHours(0,0,0,0);
    let entry = dates.find(e => e.name == date);
    if (entry) {
      entry.value++;
    } else {
      dates.push({
        name: date,
        value: 1,
      });
    }
  }
  return dates;
}

module.exports = router;
