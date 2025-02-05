import { Schema, model, models } from 'mongoose';

const InventorySchema = new Schema({
  name: { type: String, required: true },
  marking: { type: String, required: true },
  manufacture: { type: String, required: true },
  packagetype: { type: String, required: true },
  description: { type: String, required: true },
  datasheet: { type: String, required: false },
  category: { type: String, required: true }, 
  subcategory: { type: String, required: false },  
});

const Inventory = models.Inventory || model("Inventory", InventorySchema);

export default Inventory;
