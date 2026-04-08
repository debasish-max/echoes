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
    console.log('Starting Cloudinary upload for file:', {
      name: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      hasBuffer: !!file.buffer
    });

    if (!file.buffer) {
      console.error('Upload Error: File buffer is missing');
      return reject(new Error('File buffer is missing'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: `batch-26/${folder}`,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(error);
        }
        console.log('Cloudinary Upload Success:', result!.secure_url);
        resolve(result!.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};

export default upload;
