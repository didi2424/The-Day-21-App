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

export async function GET() {
  try {
    await connectToDB();
    const hardwareTransactions = await HardwareTransaction.find({}).populate('serviceId');
    console.log('Found hardware transactions:', hardwareTransactions); // Debug log
    return NextResponse.json(hardwareTransactions);
  } catch (error) {
    console.error('Error fetching hardware:', error);
    return NextResponse.json(
      { message: "Failed to fetch hardware transactions", error: error.message },
      { status: 500 }
    );
  }
}
