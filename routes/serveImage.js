const Image = require("../models/Image");

const serveImage = async (req, res) => {
    try {
        let { id } = req.params;
        let image = await Image.findOne({ _id: id });

        res.setHeader('Content-Type', 'image/jpeg');
        res.send(image.buffer);

    } catch (error) {
        return res.status(error.statusCode ?? 500).json({ msg: error?.message ?? "Internal server error" })
    }
};
module.exports = serveImage