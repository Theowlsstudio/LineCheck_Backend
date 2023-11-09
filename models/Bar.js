const mongoose = require('mongoose');

const barSchema = new mongoose.Schema({
  is_active: Boolean,
  email: String,
  password: String,
  firstname: String,
  lastname: String,
  userimage: String,
  price: String,
  number: String,
  title: String,
  offer: String,
  role: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: String,
  image: String,
  longitude: Number,
  latitude: Number,
  rating: Number,
  WaitTime: [{ type: String }],
  Volume: [{ type: Number }],
  Linequeue: [{ type: Number }]
});

const Bar = mongoose.models.Bar || mongoose.model('Bar', barSchema);

module.exports = Bar;
