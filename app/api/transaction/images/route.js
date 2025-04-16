import { connectToDB } from "@utils/database";
import TransactionImage from "@models/transactionImage";

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('transactionId');

    await connectToDB();

    const images = await TransactionImage.find({ transactionId });
    return new Response(JSON.stringify(images), { status: 200 });
  } catch (error) {
    console.error('Error fetching transaction images:', error);
    return new Response("Failed to fetch images", { status: 500 });
  }
};
