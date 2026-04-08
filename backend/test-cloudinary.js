import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

console.log('Testing Cloudinary Config:');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testUpload() {
  try {
    console.log('Attempting a test upload to Cloudinary...');
    console.log('Current Time:', new Date().toISOString());

    // Use an online image for testing
    const result = await cloudinary.uploader.upload('https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed_white_cat.jpg', {
      folder: 'test-folder',
      timeout: 60000 // 60 seconds timeout
    });

    console.log('Upload Success!');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Upload Failed at:', new Date().toISOString());
    console.error('Error Details:', error);
    if (error.http_code) console.error('HTTP Code:', error.http_code);
  }
}

testUpload();
