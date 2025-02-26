import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  // Transaction core information
  serviceNumber: {
    type: String,
    required: true,
    unique: true
  },
  // Ganti informasi customer dengan reference ke model Customer
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Constumer',
    required: true
  },
  deviceModel: {
    type: String,
    required: true
  },
  issues: [{
    type: String
  }],
  problemDescription: String,
  accessories: [{
    type: String
  }],
  serviceType: {
    type: String,
    enum: ['regular', 'urgent'],
    default: 'regular'
  },
  technician: {
    type: String,
    required: true
  },
  deviceCondition: String,
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  // Payment details
  payment: {
    method: {
      type: String,
      enum: ['cash', 'transfer', 'credit_card'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  // Financial calculations
  subtotal: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  imageIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TransactionImage'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate totals
TransactionSchema.pre('save', function(next) {
  // Calculate tax (11%)
  this.tax = this.subtotal * 0.11;
  // Calculate total
  this.total = this.subtotal + this.tax;
  next();
});

// Cek jika model sudah ada sebelum membuat yang baru
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export default Transaction;
