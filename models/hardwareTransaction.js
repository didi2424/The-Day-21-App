import { Schema, model, models } from 'mongoose';

const HardwareTransactionSchema = new Schema({
  serviceId: {
    type: String,  // Changed from ObjectId to String since we're not using Service model
    required: [true, 'Service ID is required']
  },
  replacedHardware: [{
    name: {
      type: String,
      required: [true, 'Hardware name is required']
    },
    manufacture: {
      type: String,
      required: [true, 'Manufacturer name is required']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    warranty: {
      type: String,
      required: [true, 'Warranty period is required'],
      enum: {
        values: ['0', '3', '6', '12'],
        message: 'Warranty must be 0, 3, 6, or 12 months'
      }
    },
    inventoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
      required: [true, 'Inventory ID is required']
    }
  }],
  serviceCost: {
    diagnosis: {
      type: Number,
      default: 0,
      min: [0, 'Diagnosis cost cannot be negative']
    },
    workmanship: {
      type: Number,
      default: 0,
      min: [0, 'Workmanship cost cannot be negative']
    },
    other: {
      type: Number,
      default: 0,
      min: [0, 'Other costs cannot be negative']
    }
  },
  totalCost: {
    type: Number,
    required: [true, 'Total cost is required'],
    min: [0, 'Total cost cannot be negative']
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update pre-save middleware
HardwareTransactionSchema.pre('save', async function(next) {
  try {
    // Calculate total cost
    let hardwareTotal = this.replacedHardware.reduce((sum, hw) => 
      sum + (hw.price * hw.quantity), 0
    );

    const { diagnosis, workmanship, other } = this.serviceCost;
    const serviceTotal = (diagnosis || 0) + (workmanship || 0) + (other || 0);
    this.totalCost = hardwareTotal + serviceTotal;

    // Check inventory
    if (this.isModified('replacedHardware')) {
      for (const hw of this.replacedHardware) {
        const inventory = await this.model('Inventory').findById(hw.inventoryId);
        if (!inventory) {
          throw new Error(`Inventory item ${hw.inventoryId} not found`);
        }
        if (inventory.stock < hw.quantity) {
          throw new Error(`Insufficient stock for ${inventory.name}`);
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

const HardwareTransaction = models.HardwareTransaction || model('HardwareTransaction', HardwareTransactionSchema);

export default HardwareTransaction;
