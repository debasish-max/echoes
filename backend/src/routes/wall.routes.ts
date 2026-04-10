import express from 'express';
import { getMessages, createMessage, deleteMessage } from '../controllers/wall.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', requireAdmin, createMessage);
router.delete('/:id', requireAdmin, deleteMessage);

export default router;
