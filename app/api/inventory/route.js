import { connectToDB } from "@utils/database";
import Inventory from "@models/inventory";

export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 5;
    const search = searchParams.get("search") || "";

    // Build search query
    const searchQuery = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { manufacture: { $regex: search, $options: 'i' } },
      ]
    } : {};

    // Get total count for pagination
    const totalItems = await Inventory.countDocuments(searchQuery);
    
    // Fetch inventory items with search and pagination
    const inventory = await Inventory.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return new Response(JSON.stringify({
      inventory,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems
    }), { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch inventory" 
    }), { status: 500 });
  }
}
