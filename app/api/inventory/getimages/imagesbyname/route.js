import { connectToDB } from "@utils/database";
import ImagesInventory from "@models/imagesinventory";

export const GET = async (req) => {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    let imagesnames = searchParams.getAll("names");
    if (imagesnames.length === 0) {
      const singleName = searchParams.get("names");
      if (singleName) imagesnames = [singleName];
    }
    if (!imagesnames || imagesnames.length === 0) {
      return new Response(
        JSON.stringify({ message: "No image names provided" }),
        { status: 400 }
      );
    }
    const images = await ImagesInventory.find({ name: { $in: imagesnames } });

    if (!images || images.length === 0) {
      return new Response(
        JSON.stringify({ message: "No matching images found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(images), { status: 200 });
  } catch (error) {
    console.error("Error fetching images:", error);
    return new Response(
      JSON.stringify({ message: "Gagal mengambil gambar" }),
      { status: 500 }
    );
  }
};

// DELETE method untuk menghapus gambar berdasarkan nama
export const DELETE = async (req) => {
  try {
    await connectToDB();
    const { searchParams } = new URL(req.url);
    let imagesnames = searchParams.getAll("names");

    if (imagesnames.length === 0) {
      const singleName = searchParams.get("names");
      if (singleName) imagesnames = [singleName];
    }

    if (!imagesnames || imagesnames.length === 0) {
      return new Response(
        JSON.stringify({ message: "No image names provided for deletion" }),
        { status: 400 }
      );
    }

    const deleteResult = await ImagesInventory.deleteMany({ name: { $in: imagesnames } });

    if (deleteResult.deletedCount === 0) {
      return new Response(
        JSON.stringify({ message: "No matching images found to delete" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Images deleted successfully",
        deletedCount: deleteResult.deletedCount,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting images:", error);
    return new Response(
      JSON.stringify({ message: "Gagal menghapus gambar" }),
      { status: 500 }
    );
  }
};