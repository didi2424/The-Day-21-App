import { connectToDB } from "@utils/database";
import Inventory from "@models/inventory";
import mongoose from "mongoose";

export const PATCH = async (request, context) => {
  try {
    // Tunggu params tersedia sebelum digunakan
    const params = await context.params;

    if (!params || !params.id) {
      return new Response(JSON.stringify({ error: "Missing inventory ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const id = params.id; // Ambil ID setelah menunggu params tersedia

    // Koneksi ke database
    await connectToDB();

    // Pastikan ID valid sebelum query ke database
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid inventory ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Ambil data dari request body
    const updatedData = await request.json();

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return new Response(
        JSON.stringify({ error: "No update data provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update inventory
    const updatedInventory = await Inventory.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedInventory) {
      return new Response(JSON.stringify({ error: "Inventory not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedInventory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update inventory" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (query) {
      // Handle search
      const items = await prisma.inventory.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              brand: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        take: 10,
      });
      return NextResponse.json(items);
    }

    // Existing single item fetch logic
    const id = request.url.split('/').pop();
    const inventory = await prisma.inventory.findUnique({
      where: { id },
    });
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
