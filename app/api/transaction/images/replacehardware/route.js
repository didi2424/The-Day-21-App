import { connectToDB } from '@/utils/database';
import HardwareTransactionImage from '@/models/hardwareTransactionImage';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectToDB();
    const { transactionId, imageType, imageData } = await req.json();

    const newImage = await HardwareTransactionImage.create({
      transactionId,
      imageType,
      imageData
    });

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('transactionId');

    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 });
    }

    const images = await HardwareTransactionImage.find({ transactionId });
    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const deletedImage = await HardwareTransactionImage.findByIdAndDelete(imageId);
    if (!deletedImage) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
