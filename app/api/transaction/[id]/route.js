import { connectToDB } from "@utils/database";
import Transaction from "@models/transaction";
import TransactionImage from "@models/transactionImage";

// Get specific transaction
export const GET = async (req, { params }) => {
  try {
    await connectToDB();
    const id = await params.id; // Wait for params
    
    // Get transaction with customer data
    const transaction = await Transaction.findById(id)
      .populate('customer')
      .lean()
      .exec();

    if (!transaction) {
      return new Response("Transaction not found", { status: 404 });
    }

    // Get associated images
    const images = await TransactionImage.find({ 
      transactionId: params.id 
    }).lean();

    // Format accessories data before sending
    const formattedAccessories = transaction.accessories?.map(acc => {
      if (typeof acc === 'string') {
        return { label: acc };
      }
      return acc;
    });

    // Combine transaction data with images
    const responseData = {
      ...transaction,
      accessories: formattedAccessories,
      images: {
        main: images.find(img => img.imageType === 'main'),
        additional: images.filter(img => img.imageType === 'additional')
      }
    };

    return new Response(JSON.stringify(responseData), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Transaction fetch error:', error);
    return new Response("Failed to fetch transaction", { status: 500 });
  }
};

// Update transaction
export const PATCH = async (request, { params }) => {
  try {
    await connectToDB();
    const id = await params.id;
    const data = await request.json();

    // Format image data sebelum update
    let imageUpdate = {};
    if (data.images) {
      imageUpdate = {
        'images.main': { 
          imageData: data.images.main.imageData 
        }
      };

      if (data.images.additional && Array.isArray(data.images.additional)) {
        imageUpdate['images.additional'] = data.images.additional.map(img => ({
          imageData: img.imageData
        }));
      }
    }

    // Gabungkan data update
    const updateData = {
      serviceNumber: data.serviceNumber,
      deviceModel: data.deviceModel,
      customer: data.customer,
      selectedIssues: data.selectedIssues || [],
      accessories: data.accessories || [],
      problemDescription: data.problemDescription,
      deviceCondition: data.deviceCondition,
      serviceType: data.serviceType,
      technician: data.technician,
      status: data.status,
      ...imageUpdate
    };


    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('customer');

    if (!updatedTransaction) {
      return new Response("Transaction not found", { status: 404 });
    }

    return new Response(JSON.stringify(updatedTransaction), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Transaction update error:', error);
    return new Response(JSON.stringify({
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { status: 500 });
  }
};

// Delete transaction
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();
    const id = await params.id;

    // Find and delete the transaction
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return new Response("Transaction not found", { status: 404 });
    }

    // Delete associated images if they exist
    await TransactionImage.deleteMany({ transactionId: id });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Transaction deleted successfully" 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Transaction delete error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to delete transaction",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), { status: 500 });
  }
};
