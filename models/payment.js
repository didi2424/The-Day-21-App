import { Schema, model, models } from 'mongoose';

const PaymentSchema = new Schema({
  transaction: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid', 'partial'],
    default: 'unpaid'
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'transfer', 'debit', 'credit'],
    required: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

export default models.Payment || model('Payment', PaymentSchema);
