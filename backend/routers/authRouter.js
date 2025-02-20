const express = require('express');
const authcontrollers = require("../controllers/authControllers");
const router = express.Router();


router.route('/').get(authcontrollers.home);
router.route('/register').post(authcontrollers.register);
router.route('/login').post(authcontrollers.login);

module.exports = router;