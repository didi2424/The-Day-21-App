import mongoose from 'mongoose';

const transactionImageSchema = new mongoose.Schema({
  imageName: {
    type: String,
    required: true
  },
  imageData: {
    type: String,  // Base64 string
    required: true
  },
  imageType: {
    type: String,
    enum: ['main', 'additional'],
    required: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.TransactionImage || mongoose.model('TransactionImage', transactionImageSchema);
