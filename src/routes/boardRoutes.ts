import { Router } from 'express';
import { getBoard,  } from '../controllers/boardController';
import authMiddleware from '../middleware/authMiddleware';

const router = Router();

// routes with auth
router.get('/board', authMiddleware, getBoard);

export default router;


