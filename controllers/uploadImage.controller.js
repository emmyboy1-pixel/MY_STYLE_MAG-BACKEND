import fs from "fs";
import Outfit from "../models/outfitModel.js";

export const uploadImagesToCloudinary = async (req, res) => {
  const { id: outfitId } = req.params;

  const existingOutfit = await Outfit.findByPk(outfitId);

  if (!existingOutfit) {
    return res.status(404).json({ status: false, message: "Outfit not found" });
  }

  try {
    const uploadImagesPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        folder: `outfit_images/${outfitId}`,
      })
    );

    const results = await Promise.all(uploadImagesPromises);

    // Delete all files from disk after upload is successful
    req.files.forEach((file) => fs.unlinkSync(file.path));

    const urls = results.map((r) => r.secure_url);

    // save image urls to database.
    const updatedImageUrls = [...existingOutfit.imageUrls, ...urls];

    const updateImageUrls = await Outfit.update(
      { imageUrls: updatedImageUrls },
      { where: { id: existingOutfit.id } }
    );

    if (!updateImageUrls) {
      throw new Error("Images Urls not saved on database.");
    }

    res.status(200).json({
      status: true,
      message: "Image(s) upload successfully.",
      outfitId: existingOutfit.id,
      images: urls, // Just for development
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "An error occurred while uploading images.",
      error: error.message,
    });
  }
};
