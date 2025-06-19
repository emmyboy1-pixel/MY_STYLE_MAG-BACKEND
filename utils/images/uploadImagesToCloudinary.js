import fs from "fs/promises";
import cloudinary from "../../config/cloudinary.js";

export const uploadImagesToCloudinary = async (req, type, modelId) => {
  if (!req.files || req.files.length === 0) return [];

  try {
    const uploadImagesPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        use_filename: true,
        folder: `${type}/${modelId}`,
      })
    );

    const results = await Promise.all(uploadImagesPromises);
    console.log(results);

    const urls = results.map((r) => r.secure_url);

    // clean up local files
    await Promise.all(req.files.map((file) => fs.unlink(file.path)));

    return urls;
  } catch (error) {
    throw new Error(`Failed to upload images to Cloudinary: ${error.message}`);
  }
};
