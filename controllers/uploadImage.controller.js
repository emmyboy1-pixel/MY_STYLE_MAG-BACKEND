import fs from "fs/promises";
import { Outfit } from "../models/index.js";
import { v2 as cloudinary } from "cloudinary";
import asyncWrapper from "../middleware/async.js";

export const uploadImagesToCloudinary = asyncWrapper(async (req, res) => {
  try {
    const { id: outfitId } = req.params;

    const existingOutfit = await Outfit.findByPk(outfitId);
    if (!existingOutfit) {
      await Promise.all(req.files.map((file) => fs.unlink(file.path)));
      return res
        .status(404)
        .json({ status: false, message: "Outfit not found" });
    }

    const uploadImagesPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, {
        use_filename: true,
        folder: `outfit_images/${outfitId}`,
      })
    );

    const results = await Promise.all(uploadImagesPromises);

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

    // clean up local files
    await Promise.all(req.files.map((file) => fs.unlink(file.path)));

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
});
