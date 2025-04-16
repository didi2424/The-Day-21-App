import { connectToDB } from "@utils/database";
import TransactionImage from "@models/transactionImage";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const id = await params.id;

    const images = await TransactionImage.find({ transactionId: id });
    return new Response(JSON.stringify(images), { status: 200 });
  } catch (error) {
    console.error('Error fetching transaction images:', error);
    return new Response("Failed to fetch images", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();
    await TransactionImage.findByIdAndDelete(params.id);
    return new Response("Image deleted", { status: 200 });
  } catch (error) {
    console.error('Error deleting transaction image:', error);
    return new Response("Failed to delete image", { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  try {
    await connectToDB();
    const id = await params.id;
    const { images } = await request.json();

    console.log('Received images data:', {
      hasMain: !!images.main?.imageData,
      additionalCount: images.additional?.length || 0
    });

    // Delete existing images
    await TransactionImage.deleteMany({ transactionId: id });

    // Save main image if it exists and has valid data
    if (images.main?.imageData && images.main.imageData.trim() !== '') {
      await TransactionImage.create({
        transactionId: id,
        imageType: 'main',
        imageData: images.main.imageData
      });
    }

    // Filter and save valid additional images
    if (images.additional?.length > 0) {
      const validAdditionalImages = images.additional
        .filter(img => img.imageData && img.imageData.trim() !== '')
        .map(img => ({
          transactionId: id,
          imageType: 'additional',
          imageData: img.imageData
        }));

      if (validAdditionalImages.length > 0) {
        await TransactionImage.insertMany(validAdditionalImages);
      }
    }

    const updatedImages = await TransactionImage.find({ transactionId: id });
    console.log('Saved images count:', updatedImages.length);
    return new Response(JSON.stringify(updatedImages), { status: 200 });

  } catch (error) {
    console.error('Image update error details:', {
      message: error.message,
      name: error.name,
      errors: error.errors
    });
    return new Response(JSON.stringify({ 
      message: error.message,
      details: error.errors 
    }), { status: 500 });
  }
};
