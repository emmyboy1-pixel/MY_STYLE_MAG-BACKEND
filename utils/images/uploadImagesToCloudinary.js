import cloudinary from "../../config/cloudinary.js";

export const uploadImagesToCloudinary = async (req, type, modelId) => {
  if (!req.files || req.files.length === 0) return [];

  try {
    const uploadImagesPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        use_filename: true,
        folder: `my_style_mag/${type}/${modelId}`,
      })
    );

    const results = await Promise.all(uploadImagesPromises);

    const urls = results.map((r) => r.secure_url);

    return urls;
  } catch (error) {
    throw new Error(`Failed to upload images to Cloudinary: ${error.message}`);
  }
};
