import mongoose, { Schema, Document } from 'mongoose';

export interface IYearbook extends Document {
  name: string;
  bio: string;
  department: string;
  hobbies: string[];
  instagram: string;
  linkedin: string;
  imageUrl: string;
  createdAt: Date;
}

const YearbookSchema: Schema = new Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  department: { type: String, default: 'CSE' },
  hobbies: [{ type: String }],
  instagram: { type: String },
  linkedin: { type: String },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IYearbook>('Yearbook', YearbookSchema);
