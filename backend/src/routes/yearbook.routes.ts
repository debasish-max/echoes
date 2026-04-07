import express from 'express';
import { getYearbook, createYearbookEntry, updateYearbookEntry, deleteYearbookEntry } from '../controllers/yearbook.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getYearbook);
router.post('/', requireAdmin, upload.single('image'), createYearbookEntry);
router.put('/:id', requireAdmin, updateYearbookEntry);
router.delete('/:id', requireAdmin, deleteYearbookEntry);

export default router;
