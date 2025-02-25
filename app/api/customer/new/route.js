import Constumer from "@models/constumer";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  try {
    await connectToDB();

    const requestData = await request.json();
    console.log('Received data:', requestData); // Add this for debugging

    const {
      wa_number,
      constumer_name,
      organisation,
      company,
      status, // Ensure status is at root level
      constumer_address
    } = requestData;

    // Validate required fields
    if (!status) {
      return new Response(
        JSON.stringify({ error: "Status is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for existing customer
    const existingCustomer = await Constumer.findOne({ wa_number });
    if (existingCustomer) {
      return new Response(
        JSON.stringify({ message: "Nomor telepon sudah terdaftar" }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newConstumer = new Constumer({
      wa_number,
      constumer_name,
      organisation,
      company,
      status,
      constumer_address
    });

    await newConstumer.save();
    return new Response(JSON.stringify(newConstumer), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Customer creation error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.errors // Include validation errors in response
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
