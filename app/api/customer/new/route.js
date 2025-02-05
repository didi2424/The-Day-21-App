import Constumer from "@models/constumer";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  const {
    wa_number,
    constumer_name,
    organisation,
    company,
    constumer_address: { street, city, kecamatan, kabupaten, province, postal_code },
  } = await request.json(); // Ambil data yang dikirimkan dari frontend

  try {
    // Connect ke database MongoDB
    await connectToDB();

    // Cek apakah nomor telepon sudah ada
    const existingCustomer = await Constumer.findOne({ wa_number });
    if (existingCustomer) {
      // Jika sudah ada, kembalikan status 409 Conflict
      return new Response(
        JSON.stringify({ message: "Nomor telepon sudah terdaftar" }),
        { status: 409 }
      );
    }

    // Membuat document baru berdasarkan data yang diterima dari frontend
    const newConstumer = new Constumer({
      wa_number,
      constumer_name,
      organisation,
      company,
      constumer_address: {
        street,
        city,
        kecamatan,
        kabupaten,
        province,
        postal_code,
      },
    });

    // Simpan data customer ke database
    await newConstumer.save();

    // Kirim respons jika berhasil disimpan
    return new Response(JSON.stringify(newConstumer), { status: 201 });
  } catch (error) {
    // Jika terjadi error, kirim respons dengan status 500
    console.error(error);
    return new Response("Failed to create a new customer", { status: 500 });
  }
};
