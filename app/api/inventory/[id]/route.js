import { connectToDB } from "@utils/database";
import Inventory from "@models/inventory";
export const PATCH = async (request, { params }) => {
  try {
    // Koneksi ke database
    await connectToDB();

    // Ambil ID dari parameter
    const { id } = params;

    // Ambil data yang dikirimkan oleh client
    const updatedData = await request.json();

    // Temukan inventory berdasarkan ID dan update dengan data baru
    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      { $set: updatedData }, // Hanya update field yang dikirimkan
      { new: true, runValidators: true } // Mengembalikan data terbaru setelah update
    );

    if (!updatedInventory) {
      return new Response(JSON.stringify({ error: "Inventory not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updatedInventory), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return new Response(JSON.stringify({ error: "Failed to update inventory" }), {
      status: 500,
    });
  }
};
