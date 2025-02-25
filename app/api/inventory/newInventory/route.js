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
    stock,
    sku,
    stroage,
    condition,
    row,
    column,
    imagesnames

  } = await request.json();  

  try {
    await connectToDB();

    const existingProduct = await Inventory.findOne({ name });
    if (existingProduct) {
      return new Response(
        JSON.stringify({ message: 'Produk dengan nama ini sudah ada' }),
        { status: 409 }
      );
    }

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
      stock,
      sku,
      condition,
      stroage,
      row,
      column,
      imagesnames
    });

    await newInventory.save();

    return new Response(JSON.stringify(newInventory), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response('Failed to create a new product', { status: 500 });
  }
};
