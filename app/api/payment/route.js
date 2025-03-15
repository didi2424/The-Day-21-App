import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import Payment from "@/models/payment";

export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json();
    
    if (!body.transaction) {
      return NextResponse.json(
        { message: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const payment = await Payment.create(body);
    const populatedPayment = await Payment.findById(payment._id).populate({
      path: 'transaction',
      select: '_id serviceNumber'
    });
    
    return NextResponse.json(populatedPayment, { status: 201 });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { message: "Failed to create payment" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('transactionId');

    if (transactionId) {
      // Find payment for specific transaction
      const payment = await Payment.findOne({ transaction: transactionId }).populate({
        path: 'transaction',
        select: '_id serviceNumber'
      });
      return NextResponse.json(payment || { status: 'unpaid' });
    }

    // Get all payments if no transactionId is provided
    const payments = await Payment.find().populate({
      path: 'transaction',
      select: '_id serviceNumber'
    });
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
