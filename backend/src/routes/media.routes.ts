import express from 'express';
import { getMedia, createMediaEntry, deleteMediaEntry } from '../controllers/media.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getMedia);
router.post('/', requireAuth, upload.single('image'), createMediaEntry);
router.delete('/:id', requireAdmin, deleteMediaEntry);

export default router;
