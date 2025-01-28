import { Schema, model, models } from 'mongoose';

// Membuat schema untuk Address
const AddressSchema = new Schema({
  street: {
    type: String,
    required: [true, 'Street is required'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
  },
  kec: {
    type: String,
    required: [true, 'Kecamatan is required'],
  },
  kab: {
    type: String,
    required: [true, 'Kabupaten is required'],
  },
  province: {
    type: String,
    required: [true, 'Province is required'],
  },
  postal_code: {
    type: String,
    required: [true, 'Postal code is required'],
    match: [/^\d{5}$/, 'Postal code must be 5 digits'],  // Menambahkan validasi kode pos
  },
});

// Membuat schema untuk Customer
const ConstumerSchema = new Schema({
  wa_number: {
    type: String,
    unique: [true, 'WA number is already exists!'],
    required: [true, 'WA number is required'],
  },
  constumer_name: {
    type: String,
    required: [true, 'Customer name is required'],
  },
  constumer_address: {
    type: AddressSchema,  // Menggunakan schema Address sebagai subdocument
    required: [true, 'Customer address is required'],
  },
});

const Constumer = models.Constumer || model("Constumer", ConstumerSchema);

export default Constumer;
