import { Schema, model, models } from 'mongoose';

const TransactionImageSchema = new Schema({
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  imageType: {
    type: String,
    enum: ['main', 'additional'],
    required: true
  },
  imageData: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default models.TransactionImage || model('TransactionImage', TransactionImageSchema);
