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
  description: String,
  image: String,
  longitude: Number,
  latitude: Number,
  rating: Number

});

const Bar = mongoose.models.Bar || mongoose.model('Bar', barSchema);

module.exports = Bar;
