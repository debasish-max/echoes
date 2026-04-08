import express from 'express';
import { getStudentMessages, postStudentMessage } from '../controllers/message.controller.js';

const router = express.Router();

router.get('/:studentId', getStudentMessages);
router.post('/:studentId', postStudentMessage);

export default router;
