import { NextResponse } from "next/server";
import { connectToDB } from "@utils/database";
import Payment from "@/models/payment";

export async function GET(req, { params }) {
  try {
    await connectToDB();
    const payment = await Payment.findById(params.id).populate('transaction');
    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch payment" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const body = await req.json();
    const payment = await Payment.findByIdAndUpdate(params.id, body, { new: true });
    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update payment" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const payment = await Payment.findByIdAndDelete(params.id);
    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Payment deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete payment" },
      { status: 500 }
    );
  }
}
