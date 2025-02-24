import { connectToDB } from "@utils/database";
import Inventory from "@models/inventory";

export const GET = async (req) => {
  try {
    await connectToDB();

    // Ambil query params
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 4;

    // Hitung total data untuk pagination
    const totalItems = await Inventory.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    // Ambil data dengan pagination
    const inventory = await Inventory.find()
      .skip((page - 1) * limit)
      .limit(limit);

    return new Response(
      JSON.stringify({
        inventory,
        totalPages,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch inventory", { status: 500 });
  }
};
