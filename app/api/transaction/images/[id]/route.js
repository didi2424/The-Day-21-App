import { connectToDB } from "@utils/database";
import TransactionImage from "@models/transactionImage";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const id = await params.id;

    const images = await TransactionImage.find({ transactionId: id });
    return new Response(JSON.stringify(images), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch images", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();
    await TransactionImage.findByIdAndDelete(params.id);
    return new Response("Image deleted", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete image", { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  try {
    await connectToDB();
    const id = await params.id;
    const { images } = await request.json();

    // Delete existing images
    await TransactionImage.deleteMany({ transactionId: id });

    // Save main image
    if (images.main?.imageData) {
      await TransactionImage.create({
        transactionId: id,
        imageType: 'main',
        imageData: images.main.imageData
      });
    }

    // Save additional images
    if (images.additional?.length > 0) {
      const additionalImagesData = images.additional.map(img => ({
        transactionId: id,
        imageType: 'additional',
        imageData: img.imageData
      }));
      await TransactionImage.insertMany(additionalImagesData);
    }

    const updatedImages = await TransactionImage.find({ transactionId: id });
    return new Response(JSON.stringify(updatedImages), { status: 200 });

  } catch (error) {
    console.error('Image update error:', error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
};
