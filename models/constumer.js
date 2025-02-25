import { Schema, model, models } from "mongoose";

const ConstumerSchema = new Schema({
  wa_number: {
    type: String,
    required: [true, "WhatsApp number is required"],
  },
  constumer_name: {
    type: String,
    required: [true, "Name is required"],
  },
  organisation: {
    type: String,
    required: [true, "Organisation is required"],
  },
  company: {
    type: String,
    required: [true, "Company is required"],
  },
  status: {
    type: String,
    required: [true, "Status is required"],
  },
  constumer_address: {
    street: {
      type: String,
      required: [true, "Street is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    kecamatan: {
      type: String,
      required: [true, "Kecamatan is required"],
    },
    kabupaten: {
      type: String,
      required: [true, "Kabupaten is required"],
    },
    province: {
      type: String,
      required: [true, "Province is required"],
    },
    postal_code: {
      type: String,
      required: [true, "Postal code is required"],
    }
  },
}, { timestamps: true });

const Constumer = models.Constumer || model("Constumer", ConstumerSchema);

export default Constumer;
