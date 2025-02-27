const express = require('express');
const router = express.Router();

const boardController = require('../controllers/boardController');

const authMiddleware = require('../middleware/authMiddleware');

router.get('/board', authMiddleware, boardController.getBoard);
router.post('/column', authMiddleware, boardController.addColumn);
router.patch('/card/move', authMiddleware, boardController.moveCard);
router.delete('/card/:cardId/remove', authMiddleware, boardController.removeCard);


router.delete('/column/:columnId/remove', authMiddleware, boardController.removeColumn);

router.patch('/column/:columnId/rename', authMiddleware, boardController.renameColumn);

router.post('/column/:columnId/card', authMiddleware, boardController.addCardToColumn);

module.exports = router;

