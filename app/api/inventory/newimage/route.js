import { connectToDB } from '@utils/database';
import ImagesInventory from '@models/imagesinventory';

export const POST = async (request) => {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ message: 'Gambar tidak boleh kosong' }),
        { status: 400 }
      );
    }

    await connectToDB();

    // Generate nama unik berdasarkan waktu
    const timestamp = Date.now();
    const imageName = `image_${timestamp}.png`;

    // Simpan ke database
    const newImage = new ImagesInventory({
      name: imageName,
      images: [{ imageName, imageData: image }],
    });

    await newImage.save();

    return new Response(JSON.stringify({ imageName }), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ message: 'Gagal menyimpan gambar', error: error.message }),
      { status: 500 }
    );
  }
};
