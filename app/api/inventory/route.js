import { connectToDB } from "@utils/database";
import Inventory from '@models/inventory';  // I

export const GET = async (request) => {
  try {
    await connectToDB();
    const inventory = await Inventory.find()

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
