import { connectToDB } from "@utils/database";
import Transaction from "@models/transaction";
import TransactionImage from "@models/transactionImage";
import Constumer from "@models/constumer";

export const GET = async (request) => {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term');
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 10;
    const skip = (page - 1) * pageSize;

    // Build the search query
    let searchQuery = {};

    if (term) {
      if (term.toLowerCase().includes('completed') || 
          term.toLowerCase().includes('pending') || 
          term.toLowerCase().includes('in-progress') || 
          term.toLowerCase().includes('waiting-parts') || 
          term.toLowerCase().includes('cancelled')) {
        // If term contains status keywords, add status filter
        const status = term.toLowerCase();
        searchQuery.status = {
          $regex: status,
          $options: 'i'
        };
      } else {
        // Search for customer info or service number
        const matchingCustomers = await Constumer.find({
          $or: [
            { constumer_name: { $regex: term, $options: 'i' } },
            { wa_number: { $regex: term, $options: 'i' } }
          ]
        }).select('_id');

        const customerIds = matchingCustomers.map(customer => customer._id);

        searchQuery = {
          $or: [
            { serviceNumber: { $regex: term, $options: 'i' } },
            { customer: { $in: customerIds } }
          ]
        };
      }
    }

    const transactions = await Transaction.find(searchQuery)
      .populate('customer')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalTransactions = await Transaction.countDocuments(searchQuery);

    // Get images for search results
    const transactionsWithImages = await Promise.all(
      transactions.map(async (transaction) => {
        const images = await TransactionImage.find({
          transactionId: transaction._id
        }).lean();

        return {
          ...transaction,
          images: {
            main: images.find(img => img.imageType === 'main'),
            additional: images.filter(img => img.imageType === 'additional')
          }
        };
      })
    );

    return new Response(JSON.stringify({
      transactions: transactionsWithImages,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / pageSize),
      totalTransactions
    }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), { status: 500 });
  }
};
