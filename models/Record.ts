import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    user:     { type: String, required: true },
    password: { type: String, required: true },
    email:    { type: String, required: true },
    groupid:  { type: Number, required: true },
  },
  { timestamps: true }
);

// Prevent model compilation errors on hot-reloads in development:
const Record = mongoose.models.Record || mongoose.model('Record', recordSchema);

export default Record;
