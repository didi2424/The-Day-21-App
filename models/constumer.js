import { Schema, model, models } from 'mongoose';

// Membuat schema untuk Address
const AddressSchema = new Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  kecamatan: { type: String, required: true },
  kabupaten: { type: String, required: true },
  province: { type: String, required: true },
  postal_code: { type: String, required: true, match: [/^\d{5}$/, 'Postal code must be 5 digits'] },
});

// Membuat schema untuk Customer dengan opsi timestamps
const ConstumerSchema = new Schema(
  {
    wa_number: { type: String, unique: true, required: true },
    constumer_name: { type: String, required: true },
    organisation: { type: String, required: true },
    company: { type: String, required: true },
    constumer_address: { type: AddressSchema, required: true },
  },
  {
    timestamps: true, // Mengaktifkan createdAt dan updatedAt
  }
);

const Constumer = models.Constumer || model("Constumer", ConstumerSchema);

export default Constumer;
