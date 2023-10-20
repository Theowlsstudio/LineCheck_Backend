// routes/barRoutes.js
const express = require('express');
const router = express.Router();
const Bar = require('../models/Bar');
const upload = require('../utliz/multer');
const Image = require('../models/Image');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let jwt_key = 'thisisjwtkey'


// Create a new bar
router.post('/bars', upload.any(), async (req, res) => {
  try {


    let { email, password } = req.body;
    let files = req.files;

    if (!email || !password) {
      return res.status(400).json({ msg: "Bad request" })
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists with this email!" })
    }

    let bar_user = await Bar.findOne({ email });

    if (bar_user) {
      return res.status(400).json({ msg: "Bad request user already exitsts with this email!" })
    }

    let hash = await bcrypt.hash(password, 12);

    const newBar = new Bar({ ...req.body, password: hash });
    const savedBar = await newBar.save();

    if (files?.length > 0) {
      await files.forEach(async (element) => {
        let uploadImage = await Image.create({ ...element, bar: savedBar._id });
        let saveImage = await uploadImage.save();

        if (element.fieldname === 'bar_image') {
          savedBar.image = `https://linkcheckbackend-production.up.railway.app/image/${saveImage._id}`;
          await savedBar.save();
        } else {
          savedBar.userimage = `https://linkcheckbackend-production.up.railway.app/image/${saveImage._id}`;
          await savedBar.save();
        }

      });
    }

    let token = jwt.sign({ _id: savedBar._id }, jwt_key)

    return res.status(201).json({ msg: "done", token });
  } catch (error) {
    console.error(error, error.message);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Get all bars
router.get('/bars', async (req, res) => {
  try {
    const bars = await Bar.find({});
    res.status(200).json(bars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Get a specific bar by ID
router.get('/bars/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const bar = await Bar.findById(id);
    if (!bar) {
      return res.status(404).json({ error: 'Bar not found' });
    }
    res.status(200).json(bar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Update a specific bar by ID
router.patch('/bars/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBar = await Bar.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBar) {
      return res.status(404).json({ error: 'Bar not found' });
    }
    res.status(200).json(updatedBar);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Delete a specific bar by ID
router.delete('/bars/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBar = await Bar.findByIdAndDelete(id);
    if (!deletedBar) {
      return res.status(404).json({ error: 'Bar not found' });
    }
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
