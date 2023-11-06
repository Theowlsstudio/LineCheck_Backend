const { Router } = require("express");
const upload = require("../utliz/multer");
const { createBar, getBars, getBarById, updateBarById, deleteBar, createBarOffer } = require("../controllers/bars");
const router = Router();

router.post('/bars', upload.any(), createBar);
router.get('/bars', getBars);
router.get('/bars/:id', getBarById);
router.patch('/bars/:id', updateBarById);
router.delete('/bars/:id', deleteBar);
router.post('/bars/:barId/offers', createBarOffer);


module.exports = router;