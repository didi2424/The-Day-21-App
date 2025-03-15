import { connectToDB } from "@utils/database";
import Transaction from "@models/transaction";
import TransactionImage from "@models/transactionImage";
import Customer from "@models/constumer"; // Import Customer model


export const GET = async (request) => {
  try {
    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 5;
    const skip = (page - 1) * pageSize;


    // Pastikan schema Customer terdaftar sebelum melakukan populate
    let transactions = await Transaction.find()
      .populate({
        path: 'customer',
        model: Customer, // Explicitly specify the model
        select: 'constumer_name wa_number constumer_address' // Select specific fields
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    console.log('Sample transaction:', transactions[0]); // Debug log

    const totalTransactions = await Transaction.countDocuments();

    // Get images with error handling
    const transactionsWithImages = await Promise.all(
      transactions.map(async (transaction) => {
        try {
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
        } catch (imageError) {
          console.error('Image fetch error:', imageError);
          return transaction;
        }
      })
    );

    return new Response(JSON.stringify({
      transactions: transactionsWithImages,
      currentPage: page,
      totalPages: Math.ceil(totalTransactions / pageSize),
      totalTransactions
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }), { status: 500 });
  }
};

export const POST = async (req) => {
  try {
    await connectToDB();
    const data = await req.json();
    
    // Check if service number exists
    const existingTransaction = await Transaction.findOne({ 
      serviceNumber: data.serviceNumber 
    });
    
    if (existingTransaction) {
      return new Response(JSON.stringify({ 
        error: "Service Number already exists",
        message: "Service Number Sudah Ada"
      }), { status: 409 });
    }

    // Create transaction first to get the ID
    const newTransaction = await Transaction.create({
      serviceNumber: data.serviceNumber,
      customer: data.customerDetails.id,
      deviceModel: data.serviceDetails.deviceModel,
      selectedIssues: data.serviceDetails.issues.map(issue => ({
        id: issue.id,
        label: issue
      })),
      accessories: data.serviceDetails.accessories.map(acc => ({
        id: acc.id,
        label: acc
      })),
      problemDescription: data.serviceDetails.problemDescription,
      deviceCondition: data.deviceCondition,
      serviceType: data.serviceDetails.serviceType,
      technician: data.serviceDetails.technician,
      status: 'pending'
    });

    // Save images if they exist
    if (data.images.main) {
      await TransactionImage.create({
        imageName: `${data.serviceNumber}-main`,
        imageData: data.images.main,
        imageType: 'main',
        transactionId: newTransaction._id
      });
    }

    if (data.images.additional?.length > 0) {
      await Promise.all(
        data.images.additional.map((imgData, index) => 
          TransactionImage.create({
            imageName: `${data.serviceNumber}-additional-${index}`,
            imageData: imgData,
            imageType: 'additional',
            transactionId: newTransaction._id
          })
        )
      );
    }

    return new Response(JSON.stringify(newTransaction), { status: 201 });
  } catch (error) {
    console.error('Transaction creation error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      message: "Failed to create transaction"
    }), { status: 500 });
  }
};
