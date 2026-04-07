import mongoose, { Schema, Document } from 'mongoose';

export interface IMedia extends Document {
  uploadedBy: string; // Clerk ID
  imageUrl: string;
  caption?: string;
  createdAt: Date;
}

const MediaSchema: Schema = new Schema({
  uploadedBy: { type: String, required: true },
  imageUrl: { type: String, required: true },
  caption: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IMedia>('Media', MediaSchema);
