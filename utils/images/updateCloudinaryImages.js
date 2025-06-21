import fs from "fs/promises";
import cloudinary from "../../config/cloudinary.js";

export const updateCloudinaryImages = async (req, type, modelId) => {
  const folderPath = `my_style_mag/${type}/${modelId}`;

  if (!req.files || req.files.length === 0) {
    await cloudinary.api.delete_resources_by_prefix(folderPath);
    return [];
  }

  try {
    await cloudinary.api.delete_resources_by_prefix(folderPath);

    const uploadImagesPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        use_filename: true,
        folder: folderPath,
      })
    );

    const results = await Promise.all(uploadImagesPromises);

    const urls = results.map((r) => r.secure_url);

    return urls;
  } catch (error) {
    throw new Error(`Failed to upload images to Cloudinary: ${error.message}`);
  }
};
