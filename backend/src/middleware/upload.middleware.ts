import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

// Configure memory storage to handle the file as a buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Custom function to upload a buffer to Cloudinary
 * Returns the URL of the uploaded image
 */
export const uploadToCloudinary = (file: Express.Multer.File, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: `batch-26/${folder}`,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};

export default upload;
