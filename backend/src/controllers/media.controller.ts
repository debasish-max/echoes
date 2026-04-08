import type { Request, Response } from 'express';
import Media from '../models/Media.js';

export const getMedia = async (req: Request, res: Response) => {
  try {
    const photos = await Media.find().sort({ createdAt: -1 });
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching media vault photos', error });
  }
};

import { uploadToCloudinary } from '../middleware/upload.middleware.js';
import { getAuth } from '@clerk/express';

export const createMediaEntry = async (req: Request, res: Response) => {
  try {
    console.log('Vault Upload:', { body: req.body, file: req.file });
    const auth = getAuth(req);
    const uploadedBy = auth.userId;
    const { caption } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file, 'vault');
    }
    
    if (!uploadedBy || !imageUrl) {
        return res.status(400).json({ message: 'User ID and Image are required' });
    }

    const newMedia = new Media({
      uploadedBy,
      imageUrl,
      caption: caption || 'Shared memory'
    });

    await newMedia.save();
    res.status(201).json(newMedia);
  } catch (error) {
    res.status(500).json({ message: 'Error creating media entry', error });
  }
};

export const updateMediaEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { caption } = req.body;
    let imageUrl = req.body.imageUrl;

    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file, 'vault');
    }

    const updateData: any = { caption };
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const updatedMedia = await Media.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedMedia) {
      return res.status(404).json({ message: 'Media entry not found' });
    }
    
    res.status(200).json(updatedMedia);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating media entry', error: error.message });
  }
};

export const deleteMediaEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Media.findByIdAndDelete(id);
    res.status(200).json({ message: 'Media entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting media entry', error });
  }
};
