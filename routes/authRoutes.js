// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const Bar = require('../models/Bar');

let jwt_key = 'thisisjwtkey'

router.post('/signup', async (req, res) => {

  try {
    const { username, email, password, role } = req.body;
    console.log(req.body)
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    let hash = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hash,
      role
    });

    // Save the user to the database
    let savedUser = await newUser.save();

    let token = jwt.sign({ _id: savedUser._id }, jwt_key);

    return res.status(201).json({
      message: 'User registered successfully', token, user: {
        username: savedUser.username,
        email: savedUser.email,
        number: savedUser.number,
        role_type: savedUser.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Duplicate key error' });
    }

    res.status(500).json({ error: 'Internal Server Error', details: error.message });

  }
});

router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    let user = await User.findOne({ email })

    if (user) {

      let matchpassword = bcrypt.compare(password, user.password);
      if (!matchpassword) {
        return res.status(400).json({ msg: "Bad request, credentails didn't matched!" })
      };

      let token = jwt.sign({ _id: user._id }, jwt_key);

      return res.status(200).json({
        msg: "Login successfull", token, user: {
          username: user.username,
          email: user.email,
          number: user.number,
          role_type: user.role,
          id: user._id
        }
      })
    }


    let bar_user = await Bar.findOne({ email })

    if (bar_user) {

      let matchpassword = bcrypt.compare(password, bar_user.password);

      if (!matchpassword) {
        return res.status(400).json({ msg: "Bad request, credentails didn't matched!" })
      };

      let token = jwt.sign({ _id: bar_user._id }, jwt_key);

      return res.status(200).json({
        msg: "Login successfull", token, user: {
          firstname: bar_user.firstname,
          email: bar_user.email,
          number: bar_user.number,
          role_type: bar_user.role,
          id: bar_user._id,
          description:bar_user.description,
          rating:bar_user.rating
        }
      })
    }

  } catch (error) {
    return res.status(error?.statusCode ?? 500).json({ msg: error?.message ?? 'internal server error' })
  }
});

router.post('/admin/register', (req, res) => {
  // Implement sub-admin registration logic
  res.send('Admin registration route');
});

module.exports = router;





