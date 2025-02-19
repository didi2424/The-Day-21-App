import { connectToDB } from '@utils/database';
import ImagesInventory from '@models/imagesinventory';

export const GET = async () => {
  try {
    await connectToDB();

    const images = await ImagesInventory.find({});
    
    return new Response(JSON.stringify(images), { status: 200 });
  } catch (error) {
    console.error('Error fetching images:', error);
    return new Response(JSON.stringify({ message: 'Gagal mengambil gambar' }), { status: 500 });
  }
};