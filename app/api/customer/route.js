import { connectToDB } from "@utils/database";
import Customer from "@models/constumer";

export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("pageSize")) || 7;

    // Hitung total customers dulu
    const totalCustomers = await Customer.countDocuments();
    
    // Fetch customers dengan pagination
    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    // Log untuk debugging
    console.log('API Response:', {
      page,
      pageSize,
      totalCustomers,
      customersReturned: customers.length,
      totalPages: Math.ceil(totalCustomers / pageSize)
    });

    return new Response(
      JSON.stringify({
        customers,
        totalCustomers,
        currentPage: page,
        totalPages: Math.ceil(totalCustomers / pageSize)
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch customers" }),
      { status: 500 }
    );
  }
}
