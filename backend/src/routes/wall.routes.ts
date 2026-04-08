import express from 'express';
import { getMessages, createMessage } from '../controllers/wall.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', requireAdmin, createMessage);

export default router;
