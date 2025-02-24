
  export const fetchImagesByNames = async (imagesnames) => {
    if (!Array.isArray(imagesnames) || imagesnames.length === 0) {
      console.error("Invalid imagesnames format:", imagesnames);
      return [];
    }
    try {
      const queryParams = imagesnames
        .map((name) => `names=${encodeURIComponent(name)}`)
        .join("&");
      const response = await fetch(
        `/api/inventory/getimages/imagesbyname?${queryParams}`
      );
  
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      const extractedImages = data.flatMap((item) =>
        item.images.map((img) => ({
          imageName: img.imageName,
          imageData: img.imageData,
        }))
      );
      return extractedImages;
    } catch (error) {
      return [];
    }
  };
  
  export const handleImageUpload = async (imageData) => {
    if (!imageData || !imageData.imageData) {
      toast.error("No image data provided");
      return null;
    }
  
    try {
      const response = await fetch("/api/inventory/newimage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData.imageData }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
  
      const data = await response.json();
      return data.imageName; // Langsung return nama gambar
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Error uploading image");
      return null;
    }
  };

  export const deleteImagesFromServer = async (deletedImages) => {
    if (!deletedImages || deletedImages.length === 0) {
      console.warn("No images to delete");
      return;
    }
  
    const queryParams = deletedImages
      .map((name) => `names=${encodeURIComponent(name)}`)
      .join("&");
  
    try {
      const response = await fetch(
        `/api/inventory/getimages/imagesbyname?${queryParams}`,
        { method: "DELETE" }
      );
  
      const data = await response.json();
      if (response.ok) {
        return true; // Berhasil menghapus
      } else {
        console.error("Error deleting images:", data.message);
        return false; // Gagal menghapus
      }
    } catch (error) {
      console.error("Network error:", error);
      return false; // Gagal menghapus
    }
  };