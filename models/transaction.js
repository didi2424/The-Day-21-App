import { Schema, model, models } from 'mongoose';

const TransactionSchema = new Schema({
  // Service identification
  serviceNumber: {
    type: String,
    required: true,
    unique: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Constumer',
    required: true
  },

  // Device information
  deviceModel: {
    type: String,
    required: true
  },
  selectedIssues: [{
    id: String,
    label: String
  }],
  accessories: [{
    id: String,
    label: String
  }],
  problemDescription: String,
  deviceCondition: String,

  // Service details
  serviceType: {
    type: String,
    enum: ['regular', 'urgent'],
    default: 'regular'
  },
  technician: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },

  // Timestamps
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

export default models.Transaction || model('Transaction', TransactionSchema);
