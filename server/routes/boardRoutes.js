const express = require('express');
const router = express.Router();

const boardController = require('../controllers/boardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/board', authMiddleware, boardController.getBoard);
router.post('/column', authMiddleware, boardController.addColumn);

router.post('/column/:columnId/card', authMiddleware, boardController.addCardToColumn);
router.delete('/card/:cardId/remove', authMiddleware, boardController.removeCard);
router.patch('/card/:cardId/move', authMiddleware, boardController.moveCard);

router.delete('/column/:columnId/remove', authMiddleware, boardController.removeColumn);
router.patch('/column/:columnId/rename', authMiddleware, boardController.renameColumn);

// UUSI: järjestyksen tallennus (SortableJS kutsuu tätä)
router.put('/columns/:columnId/reorder', authMiddleware, boardController.reorderColumnCards);

module.exports = router;
