const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();

const { Images } = require('../../database/image');
const { Logs } = require('../../database/log');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, '..', '..', 'public', 'images'));
  },
  filename: (req, file, callback) => {
    callback(null, Date.now()+path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage })
const { URL } = process.env;

router.get('/length', async ({ query }, res) => {
  try {
    let length = await Images.countDocuments({
      name: {
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
    let images = await Images.find({
      name: {
    	   $regex: query.filter,
         $options: 'i'
    	},
    })
		.skip(Number(query.pageIndex)*Number(query.pageSize))
		.limit((1+Number(query.pageIndex))*Number(query.pageSize))

    res.json(images)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/', upload.single('image'), async ({ file }, res) => {
  try {
    let image = await Images.create({
      name: file.originalname,
      src: URL+'/images/'+file.filename,
    })

    res.json(image);

    await Logs.create({
      title: 'Image created',
      text: image.get('name')+' image created successfully',
      type: 'image',
    })
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.post('/:_id', upload.single('image'), async ({ params, file }, res) => {
  try {
    let image = await Images.findOneAndUpdate({
      _id: params._id,
    }, {
      name: file.originalname,
      src: URL+'/images/'+file.filename,
    }, {
      new: true
    })
    
    res.json(image)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.put('/:_id', async ({ params, body }, res) => {
  try {
    let image = await Images.findOneAndUpdate({
      _id: params._id,
    }, body, {
      new: true
    })
    res.json(image)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

router.delete('/:_id', async ({ params }, res) => {
  try {
    let status = await Images.deleteOne({
      _id: params._id,
    })
    res.json(status)
  } catch(e) {
    console.error(e);
    res.sendStatus(500);
  }
});

module.exports = router;
