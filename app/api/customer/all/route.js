import { connectToDB } from "@utils/database";
import Customer from "@models/constumer";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectToDB();
        const customers = await Customer.find().sort({ createdAt: -1 });
        
        return NextResponse.json({ 
            message: "Customers fetched successfully",
            success: true,
            customers 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            message: "Error fetching customers",
            success: false,
            error: error.message 
        }, { status: 500 });
    }
}
