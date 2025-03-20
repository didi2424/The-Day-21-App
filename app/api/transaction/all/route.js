import { connectToDB } from "@utils/database";
import Transaction from "@models/transaction";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDB();
        const transactions = await Transaction.find();
        
        return NextResponse.json({ 
            message: "Transactions fetched successfully",
            success: true,
            transactions 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            message: "Error fetching transactions",
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}
