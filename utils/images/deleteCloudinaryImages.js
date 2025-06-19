import cloudinary from "../../config/cloudinary.js";

export const deleteCloudinaryImages = async (type, modelId) => {
  try {
    const folderPath = `${type}/${modelId}`;
    await cloudinary.api.delete_resources_by_prefix(folderPath);
    await cloudinary.api.delete_folder(folderPath);
    return true;
  } catch (error) {
    throw new Error(
      `Failed to delete images from cloudinary: ${error.message}`
    );
  }
};
