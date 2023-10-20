const mongoose = require('mongoose');
const offersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
    required: true,
  },
}, { timestamps: true });


const offerSchema = mongoose.model('Offer', offersSchema);
module.exports = offerSchema;
