import { Schema, model, models } from 'mongoose';

const InventorySchema =  new Schema({
  name: { type: String, required: true },
  marking: { type: String, required: true },
  price: { type: String, required: true },
  manufacture: { type: String, required: true },
  packagetype: { type: String, required: true },
  description: { type: String, required: true },
  datasheet: { type: String, required: false },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
});

const Inventory = models.Inventory || model('Inventory', InventorySchema);

// Ekspor default Inventory
export default Inventory;
