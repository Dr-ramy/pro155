import mongoose from 'mongoose';
const scoreSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'Record', required: true },
  score: { type: Number, required: true },
  testName: { type: String, required: true },
}, { timestamps: true });

const Score = mongoose.models.Score || mongoose.model('Score', scoreSchema);
export default Score;
