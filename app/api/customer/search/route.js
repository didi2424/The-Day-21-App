import { connectToDB } from "@utils/database";
import Customer from "@models/constumer";

export async function GET(request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 7;

    const searchQuery = {
      $or: [
        { constumer_name: { $regex: term, $options: 'i' } },
        { wa_number: { $regex: term, $options: 'i' } },
        { 'constumer_address.street': { $regex: term, $options: 'i' } },
        { 'constumer_address.city': { $regex: term, $options: 'i' } },
        { 'constumer_address.kabupaten': { $regex: term, $options: 'i' } },
        { 'constumer_address.province': { $regex: term, $options: 'i' } },
      ]
    };

    const totalCustomers = await Customer.countDocuments(searchQuery);
    const customers = await Customer.find(searchQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify({
      customers,
      totalCustomers,
      currentPage: page,
      totalPages: Math.ceil(totalCustomers / pageSize)
    }), { status: 200 });

  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ error: 'Failed to search customers' }), { status: 500 });
  }
}
