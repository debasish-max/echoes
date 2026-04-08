import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentMessage extends Document {
  studentId: mongoose.Types.ObjectId;
  author: string;
  content: string;
  createdAt: Date;
}

const StudentMessageSchema: Schema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'Yearbook', required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IStudentMessage>('StudentMessage', StudentMessageSchema);
