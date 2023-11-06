const {Router} = require("express");
const { SignUp, Login } = require("../controllers/auth");
const router = Router();

router.post('/signup', SignUp);
router.post('/login', Login);

module.exports = router;