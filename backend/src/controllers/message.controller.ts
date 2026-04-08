import type { Request, Response } from 'express';
import StudentMessage from '../models/StudentMessage.js';

export const getStudentMessages = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const messages = await StudentMessage.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student messages', error });
  }
};

export const postStudentMessage = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const { author, content } = req.body;

    if (!author || !content) {
      return res.status(400).json({ message: 'Author and content are required' });
    }

    const newMessage = new StudentMessage({
      studentId,
      author,
      content
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error posting student message', error });
  }
};
