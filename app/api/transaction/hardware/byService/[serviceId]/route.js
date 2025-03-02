import { connectToDB } from "@utils/database";
import HardwareTransaction from "@models/hardwareTransaction";
import Inventory from "@models/inventory"; // Add this import
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectToDB();
    console.log('Searching for serviceId:', params.serviceId);

    // Make sure Inventory model is loaded before using populate
    await Inventory.init();

    const transaction = await HardwareTransaction.findOne({ 
      serviceId: params.serviceId 
    })
    .populate('replacedHardware.inventoryId'); // Only populate inventory references

    console.log('Found transaction:', transaction);

    if (!transaction) {
      return NextResponse.json(
        { error: 'Hardware transaction not found for this service' },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error fetching hardware transaction:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hardware transaction' },
      { status: 500 }
    );
  }
}
