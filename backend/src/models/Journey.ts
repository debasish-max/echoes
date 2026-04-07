import mongoose, { Schema, Document } from 'mongoose';

export interface IJourney extends Document {
  semester: number;
  imageUrl: string;
  caption?: string;
  createdAt: Date;
}

const JourneySchema: Schema = new Schema({
  semester: { type: Number, required: true, min: 1, max: 8 },
  imageUrl: { type: String, required: true },
  caption: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IJourney>('Journey', JourneySchema);
