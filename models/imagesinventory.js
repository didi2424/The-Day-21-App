import { Schema, model, models } from "mongoose";

const ImagesInventorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    images: [
      {
        imageName: String, // Nama file gambar
        imageData: String, // Base64 atau URL gambar
      }
    ],
  },
  {
    timestamps: true, // Menyimpan waktu pembuatan & pembaruan otomatis
  }
);

const ImagesInventory = models.ImagesInventory || model("ImagesInventory", ImagesInventorySchema);
export default ImagesInventory;
