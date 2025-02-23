const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createBoard, getBoard, addColumn, addCard, moveCard, deleteCard, deleteColumn } = require('../controllers/boardController');

// Route to create a new board (protected)
router.post('/board', authMiddleware, createBoard);

// Route to get a user's board (protected)
router.get('/board', authMiddleware, getBoard);

// Route to add a column to the board (protected)
router.post('/board/:boardId/columns', authMiddleware, addColumn);

// Route to add a card to a column in the board (protected)
router.post('/board/:boardId/columns/:columnId/cards', authMiddleware, addCard);

// Route to move a card between columns (protected)
router.put('/board/:boardId/columns/:fromColumnId/cards/:cardId/move/:toColumnId', authMiddleware, moveCard);

// Route to delete a card (protected)
router.delete('/board/:boardId/columns/:columnId/cards/:cardId', authMiddleware, deleteCard);

// Route to delete a column (protected)
router.delete('/board/:boardId/columns/:columnId', authMiddleware, deleteColumn);

module.exports = router;
