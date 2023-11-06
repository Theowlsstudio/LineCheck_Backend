const Bar = require("../models/Bar");
const Image = require("../models/Image");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { JWT_SECRET, url } = require("../configurations");

const createBar = async (req, res) => {
    try {

        let { email, password } = req.body;
        let files = req?.files ?? [];

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

        const newBar = await Bar.create({ ...req.body, password: hash });

        if (files?.length > 0) {
            await files.forEach(async (element) => {
                let uploadImage = await Image.create({ ...element, bar: newBar._id });

                if (element.fieldname === 'image') {
                    newBar.image = `${url}/image/${uploadImage._id}`;
                    await newBar.save();
                } else {
                    newBar.userimage = `${url}/image/${uploadImage._id}`;
                    await newBar.save();
                }

            });
        }

        let token = jwt.sign({ _id: newBar._id }, JWT_SECRET)

        return res.status(201).json({ msg: "done", token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Get all bars
const getBars = async (req, res) => {
    try {
        const bars = await Bar.find({});
        return res.status(200).json(bars);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Get a specific bar by ID
const getBarById = async (req, res) => {
    const { id } = req.params;
    try {
        const bar = await Bar.findById(id);
        if (!bar) {
            return res.status(404).json({ error: 'Bar not found' });
        }
        return res.status(200).json(bar);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// Update a specific bar by ID
const updateBarById = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedBar = await Bar.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBar) {
            return res.status(404).json({ error: 'Bar not found' });
        }
        res.status(200).json(updatedBar);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const createBarOffer = async (req, res) => {
    const { barId } = req.params;

    try {
        const bar = await Bar.findById(barId);
        if (!bar) {
            return res.status(404).json({ error: 'Bar not found' });
        }

        // Add the new offer to the bar's offers array
        bar?.offers?.push(req.body);

        // Save the updated bar document
        const savedBar = await bar.save();

        return res.status(201).json(savedBar.offers[savedBar.offers.length - 1]);
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}

const updateBarOffer = async (req, res) => {
    try {
        const barId = req.params.barId;

        const updates = { ...req.body };

        const updatedBar = await Bar.findByIdAndUpdate(
            barId,
            { $set: updates },
            { new: true }
        );

        if (!updatedBar) {
            return res.status(404).json({ error: 'Bar not found' });
        }

        Object.keys(req.body).forEach((key) => {
            if (!updatedBar[key]) {
                updatedBar[key] = req.body[key];
            }
        });

        await updatedBar.save();

        return res.status(200).json(updatedBar);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Delete a specific bar by ID
const deleteBar = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBar = await Bar.findByIdAndDelete(id);
        if (!deletedBar) {
            return res.status(404).json({ error: 'Bar not found' });
        }
        return res.status(204).json({ msg: "Bar has been deleted." });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

module.exports = {
    createBar,
    getBars,
    getBarById,
    updateBarById,
    createBarOffer,
    updateBarOffer,
    deleteBar
}