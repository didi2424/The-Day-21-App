import { connectToDB } from "@utils/database";
import HardwareTransaction from "@models/hardwareTransaction";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectToDB();
    const data = await request.json();
    
    console.log('Received data:', data); // Debug log

    // Validate required fields
    if (!data.serviceId) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(data.replacedHardware) || data.replacedHardware.length === 0) {
      return NextResponse.json(
        { error: 'At least one hardware item is required' },
        { status: 400 }
      );
    }

    const hardwareTransaction = await HardwareTransaction.create(data);
    console.log('Created transaction:', hardwareTransaction); // Debug log

    return NextResponse.json(hardwareTransaction, { status: 201 });
  } catch (error) {
    console.error('Detailed error:', error); // Debug log
    return NextResponse.json(
      { error: error.message || 'Failed to create hardware transaction' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('serviceId');

    console.log('Received serviceId:', serviceId);

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      console.log('Invalid MongoDB ObjectId');
      return NextResponse.json(
        { error: 'Invalid Service ID format' },
        { status: 400 }
      );
    }

    const query = { serviceId: new mongoose.Types.ObjectId(serviceId) };
    console.log('Query:', query);

    const transactions = await HardwareTransaction.find(query)
      .populate({
        path: 'serviceId',
        model: 'Service'
      })
      .populate({
        path: 'replacedHardware.inventoryId',
        model: 'Inventory'
      })
      .sort({ createdAt: -1 });

    console.log('Found transactions:', JSON.stringify(transactions, null, 2));

    // Return empty array if no transactions found
    if (!transactions || transactions.length === 0) {
      return NextResponse.json([]);
    }

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Detailed error in GET:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch hardware transactions',
        details: error.stack
      },
      { status: 500 }
    );
  }
}
