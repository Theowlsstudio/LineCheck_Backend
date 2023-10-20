// routes/createOffer.js
const express = require('express');
const router = express.Router();
const Bar = require('../models/Bar');

router.post('/bars/:barId/offers', async (req, res) => {
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

    res.status(201).json(savedBar.offers[savedBar.offers.length - 1]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
