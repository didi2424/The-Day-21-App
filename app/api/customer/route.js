import { connectToDB } from "@utils/database";
import Constumer from "@models/constumer";

export const GET = async (request) => {
  try {
    // Parsing the URL to get query parameters for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page')) || 1; // Default to page 1
    const pageSize = parseInt(url.searchParams.get('pageSize')) || 8; // Default to 8 customers per page

    // Connect to MongoDB database
    await connectToDB();

    // Calculate total customers in the collection
    const totalCustomers = await Constumer.countDocuments();

    // Fetch customers with pagination (skip and limit)
    const customers = await Constumer.find()
      .skip((page - 1) * pageSize) // Skips the documents of previous pages
      .limit(pageSize); // Limits the number of customers fetched based on pageSize

    // Send the response with customers data, total count, current page, and pageSize
    return new Response(
      JSON.stringify({
        customers, // List of customers for the current page
        totalCustomers, // Total number of customers in the database
        page, // Current page number
        pageSize, // Number of items per page
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response("Failed to fetch customers", { status: 500 });
  }
};
