import { connectToDB } from "@utils/database";
import Inventory from '@models/inventory';  // I

export const GET = async (request) => {
  try {
    // Parsing the URL to get query parameters for pagination
    // Connect to MongoDB database
    await connectToDB();


    const inventory = await Inventory.find()

    // Send the response with customers data, total count, current page, and pageSize
    return new Response(
      JSON.stringify({
        inventory, 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch inventory", { status: 500 });
  }
};
