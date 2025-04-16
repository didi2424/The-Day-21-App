import { connectToDB } from "@utils/database";
import Inventory from "@models/inventory";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectToDB();

        const result = await Inventory.aggregate([
            {
                $addFields: {
                    numericPrice: { $toDouble: "$price" }
                }
            },
            {
                $group: {
                    _id: null,
                    totalValue: {
                        $sum: { $multiply: ["$numericPrice", "$stock"] }
                    },
                    totalItems: { $sum: "$stock" }
                }
            }
        ]);

        const totalValue = result[0]?.totalValue || 0;
        const totalItems = result[0]?.totalItems || 0;

        return new NextResponse(JSON.stringify({
            totalValue,
            totalItems,
            formattedValue: `Rp ${totalValue.toLocaleString('id-ID')}`
        }), { status: 200 });

    } catch (error) {
        console.error("Error fetching total inventory value:", error);
        return new NextResponse("Failed to fetch total inventory value", { status: 500 });
    }
}
