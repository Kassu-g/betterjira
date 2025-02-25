const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');
const authMiddleware = require('../middleware/authMiddleware');

// Route to create a new column
router.post('/column', authMiddleware, boardController.addColumn);

module.exports = router;
