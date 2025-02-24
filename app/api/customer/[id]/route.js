import { connectToDB } from "@utils/database";
import Constumer from "@models/constumer";

export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        // Delete the task by ID
        const deletedTask = await Constumer.findByIdAndDelete(params.id);

        if (!deletedTask) {
            return new Response("Task Not Found", { status: 404 });
        }

        return new Response("Task Deleted Successfully", { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("Failed to Delete Task", { status: 500 });
    }
};

export const PATCH = async (request, { params }) => {
    try {
      // Koneksi ke DB
      await connectToDB();
  
      // Ambil data yang ingin di-update dari body request
      const {
        wa_number,
        constumer_name,
        organisation,
        company,
        constumer_address,
      } = await request.json();
  
      // Cari customer berdasarkan ID
      const existingCustomer = await Constumer.findById(params.id);
  
      // Jika customer tidak ditemukan, kirimkan response 404
      if (!existingCustomer) {
        return new Response("Customer Not Found", { status: 404 });
      }
  
      // Update data customer jika field tersedia
      existingCustomer.wa_number = wa_number || existingCustomer.wa_number;
      existingCustomer.constumer_name = constumer_name || existingCustomer.constumer_name;
      existingCustomer.organisation = organisation || existingCustomer.organisation;
      existingCustomer.company = company || existingCustomer.company;
  
      // Pastikan hanya mengupdate alamat jika ada data alamat yang baru
      if (constumer_address) {
        existingCustomer.constumer_address = {
          ...existingCustomer.constumer_address,
          ...constumer_address, // Menambahkan/merubah bagian alamat yang ada
        };
      }
  
      // Simpan customer yang sudah diperbarui
      await existingCustomer.save();
  
      // Kembalikan data customer yang sudah diperbarui
      return new Response(JSON.stringify(existingCustomer), { status: 200 });
  
    } catch (error) {
      // Jika terjadi error, kirimkan response 500
      console.log(error);
      return new Response("Failed to Update Customer", { status: 500 });
    }
  };