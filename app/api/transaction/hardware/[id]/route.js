import { connectToDB } from "@utils/database";
import HardwareTransaction from "@models/hardwareTransaction";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectToDB();
    const transaction = await HardwareTransaction.findById(params.id)
      .populate('serviceId')
      .populate('replacedHardware.inventoryId');

    if (!transaction) {
      return NextResponse.json(
        { error: 'Hardware transaction not found' },
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

export async function PATCH(request, { params }) {
  try {
    await connectToDB();
    const data = await request.json();
    
    const updatedTransaction = await HardwareTransaction.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedTransaction) {
      return NextResponse.json(
        { error: 'Hardware transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating hardware transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update hardware transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDB();
    const deletedTransaction = await HardwareTransaction.findByIdAndDelete(params.id);

    if (!deletedTransaction) {
      return NextResponse.json(
        { error: 'Hardware transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Hardware transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting hardware transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete hardware transaction' },
      { status: 500 }
    );
  }
}
