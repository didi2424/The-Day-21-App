import { Schema, model, models } from 'mongoose';

const TransactionSchema = new Schema({
  // Transaction core information
  transactionNumber: {
    type: String,
    required: [true, "Transaction number is required"],
    unique: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  
  // Customer information
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Constumer',
    required: [true, "Customer reference is required"]
  },

  // Items in the transaction
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'inventory',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"]
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"]
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],

  // Payment details
  payment: {
    method: {
      type: String,
      required: true,
      enum: ['cash', 'transfer', 'credit_card'],
      default: 'cash'
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending'
    }
  },

  // Financial calculations
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },

  // Additional information
  notes: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Create a compound index for better query performance
TransactionSchema.index({ date: -1, status: 1 });

// Virtual field for formatted date (if needed)
TransactionSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Pre-save middleware to calculate totals
TransactionSchema.pre('save', function(next) {
  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Calculate tax (11%)
  this.tax = this.subtotal * 0.11;
  
  // Calculate total
  this.total = this.subtotal + this.tax;
  
  next();
});

const Transaction = models.Transaction || model('Transaction', TransactionSchema);

export default Transaction;
