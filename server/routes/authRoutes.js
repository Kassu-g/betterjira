const express = require('express');
const router = express.Router();

//register and login functions from the controller
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
