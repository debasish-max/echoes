import type { Request, Response } from 'express';
import Yearbook from '../models/Yearbook.js';

export const getYearbook = async (req: Request, res: Response) => {
  try {
    const students = await Yearbook.find().sort({ name: 1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching yearbook entries', error });
  }
};

import { uploadToCloudinary } from '../middleware/upload.middleware.js';

export const createYearbookEntry = async (req: Request, res: Response) => {
  try {
    console.log('Yearbook Upload:', { body: req.body, file: req.file });
    const { name, bio, hobbies, instagram } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file, 'yearbook');
    }
    
    if (!name || !bio || !imageUrl) {
        return res.status(400).json({ message: 'Name, bio, and image are required' });
    }

    const newStudent = new Yearbook({
      name,
      bio,
      hobbies: typeof hobbies === 'string' ? hobbies.split(',').map(h => h.trim()) : hobbies,
      instagram,
      imageUrl
    });

    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating yearbook entry', error });
  }
};

export const updateYearbookEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedEntry = await Yearbook.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedEntry) {
      return res.status(404).json({ message: 'Student entry not found' });
    }
    
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error updating yearbook entry', error });
  }
};

export const deleteYearbookEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Yearbook.findByIdAndDelete(id);
    res.status(200).json({ message: 'Student entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting yearbook entry', error });
  }
};
