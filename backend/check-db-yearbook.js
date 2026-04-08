import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Yearbook from './src/models/Yearbook.js';

dotenv.config();

async function listYearbook() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const entries = await Yearbook.find();
    console.log('Yearbook Entries:');
    entries.forEach(entry => {
      console.log(`Name: ${entry.name}`);
      console.log(`Image URL: ${entry.imageUrl}`);
      console.log('---');
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

listYearbook();
