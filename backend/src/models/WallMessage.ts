import mongoose, { Schema, Document } from 'mongoose';

export interface IWallMessage extends Document {
  text: string;
  createdAt: Date;
}

const WallMessageSchema: Schema = new Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IWallMessage>('WallMessage', WallMessageSchema);
