import { connectToDB } from "@utils/database";
import HardwareTransaction from "@models/hardwareTransaction";
import Inventory from "@models/inventory";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectToDB();
    await Inventory.init();

    // Ambil serviceId dari URL jika params bermasalah
    const pathname = request.nextUrl.pathname;
    const serviceId = pathname.split("/").pop(); // Ambil bagian terakhir dari URL

    if (!serviceId) {
      return NextResponse.json(
        { error: "Service ID is required" },
        { status: 400 }
      );
    }

    const transaction = await HardwareTransaction.findOne({ serviceId })
      .populate("replacedHardware.inventoryId");

    if (!transaction) {
      return NextResponse.json(
        { error: "Hardware transaction not found for this service" },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("Error fetching hardware transaction:", error);
    return NextResponse.json(
      { error: "Failed to fetch hardware transaction", details: error.message },
      { status: 500 }
    );
  }
}