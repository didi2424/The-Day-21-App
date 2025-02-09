import Inventory from '@models/inventory';  // Impor default Inventory
import { connectToDB } from '@utils/database';

export const POST = async (request) => {
  const {
    name,
    marking,
    manufacture,
    price,
    packagetype,
    description,
    datasheet,
    category,
    subcategory,
  } = await request.json();  // Ambil data dari frontend

  try {
    // Connect ke database MongoDB
    await connectToDB();

    // Cek apakah produk sudah ada
    const existingProduct = await Inventory.findOne({ name });
    if (existingProduct) {
      return new Response(
        JSON.stringify({ message: 'Produk dengan nama ini sudah ada' }),
        { status: 409 }
      );
    }

    // Membuat document baru untuk Inventory
    const newInventory = new Inventory({
      name,
      marking,
      manufacture,
      price,
      packagetype,
      description,
      datasheet,
      category,
      subcategory,
    });

    // Simpan ke database
    await newInventory.save();

    // Kirim respons jika berhasil disimpan
    return new Response(JSON.stringify(newInventory), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to create a new product', { status: 500 });
  }
};
