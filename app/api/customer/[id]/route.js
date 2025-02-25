import { connectToDB } from "@utils/database";
import Constumer from "@models/constumer";
import mongoose from "mongoose";

export const DELETE = async (request, context) => {
    try {
        await connectToDB();
        const id = context.params.id;

        const deletedTask = await Constumer.findByIdAndDelete(id);

        if (!deletedTask) {
            return new Response("Task Not Found", { status: 404 });
        }

        return new Response("Task Deleted Successfully", { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to Delete Task", { status: 500 });
    }
};

export const PATCH = async (request, context) => {
  try {
      await connectToDB();

      // Tunggu params sebelum mengakses id
      const params = await context.params;
      if (!params || !params.id) {
          return new Response(JSON.stringify({ error: "Missing customer ID" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
          });
      }

      const id = params.id;

      // Pastikan ID valid sebelum query ke database
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return new Response(JSON.stringify({ error: "Invalid customer ID" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
          });
      }

      const {
          wa_number,
          constumer_name,
          organisation,
          company,
          status,
          constumer_address,
      } = await request.json();

      const existingCustomer = await Constumer.findById(id);

      if (!existingCustomer) {
          return new Response(JSON.stringify({ error: "Customer Not Found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
          });
      }

      // Update field yang diberikan
      if (wa_number) existingCustomer.wa_number = wa_number;
      if (constumer_name) existingCustomer.constumer_name = constumer_name;
      if (organisation) existingCustomer.organisation = organisation;
      if (status) existingCustomer.status = status;
      if (company) existingCustomer.company = company;
      if (constumer_address) {
          existingCustomer.constumer_address = {
              ...existingCustomer.constumer_address,
              ...constumer_address,
          };
      }

      await existingCustomer.save();
      return new Response(JSON.stringify(existingCustomer), {
          status: 200,
          headers: { "Content-Type": "application/json" },
      });

  } catch (error) {
      console.error("Error updating customer:", error);
      return new Response(JSON.stringify({ error: "Failed to Update Customer" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
      });
  }
};