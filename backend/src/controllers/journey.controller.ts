import type { Request, Response } from 'express';
import Journey from '../models/Journey.js';

export const getJourney = async (req: Request, res: Response) => {
  try {
    const { semester } = req.query;
    let query = {};
    if (semester) {
      query = { semester: Number(semester) };
    }
    const photos = await Journey.find(query).sort({ semester: 1, createdAt: -1 });
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journey photos', error });
  }
};

import { uploadToCloudinary } from '../middleware/upload.middleware.js';

export const createJourneyEntry = async (req: Request, res: Response) => {
  try {
    console.log('Journey Upload:', { body: req.body, file: req.file });
    const { semester, caption } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file, 'journey');
    }
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const newEntry = new Journey({
      semester: Number(semester),
      caption,
      imageUrl
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error: any) {
    console.error('Journey Upload Controller Error:', error);
    res.status(500).json({ 
      message: 'Error creating journey entry', 
      error: error.message || error 
    });
  }
};

export const deleteJourneyEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Journey.findByIdAndDelete(id);
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journey entry', error });
  }
};
