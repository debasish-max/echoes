import type { Request, Response } from 'express';
import WallMessage from '../models/WallMessage.js';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await WallMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Message text is required' });
  }

  try {
    const newMessage = new WallMessage({ text });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error creating message', error });
  }
};
