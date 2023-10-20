// routes/index.js
const express = require('express');
const barRoutes = require('./BarRoutes');
const authRoutes = require('./authRoutes');
const updateOffer = require('./updateOffer');

const router = express.Router();

router.use(updateOffer);
router.use(barRoutes);
router.use(authRoutes);

module.exports = router;
