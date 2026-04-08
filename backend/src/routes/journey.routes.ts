import express from 'express';
import { getJourney, createJourneyEntry, updateJourneyEntry, deleteJourneyEntry } from '../controllers/journey.controller.js';
import { requireAdmin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getJourney);
router.post('/', requireAdmin, upload.single('image'), createJourneyEntry);
router.put('/:id', requireAdmin, upload.single('image'), updateJourneyEntry);
router.delete('/:id', requireAdmin, deleteJourneyEntry);

export default router;
