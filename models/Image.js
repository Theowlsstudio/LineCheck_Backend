const mongoose = require('mongoose');
const ImageSchema = new mongoose.Schema({
    bar: {
        type: mongoose.Types.ObjectId,
        ref: "Bar"
    },
    fieldname: { type: String },
    originalname: { type: String },
    encoding: { type: String },
    mimetype: { type: String },
    buffer: { type: Buffer },
    size: { type: Number }
});

const Image = mongoose.model('Image', ImageSchema);

module.exports = Image;
