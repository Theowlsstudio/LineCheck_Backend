// Patch a bar by ID
const express = require('express');
const router = express.Router();
const Bar = require('../models/Bar');
router.patch('/bars/:barId', async (req, res) => {
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

    res.status(200).json(updatedBar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
