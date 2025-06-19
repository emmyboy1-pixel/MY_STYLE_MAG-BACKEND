import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const OutfitTag = sequelize.define(
  "OutfitTag",
  {
    outfitId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Outfits",
        key: "id",
      },
    },
    tagId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Tags",
        key: "id",
      },
    },
  },
  { timestamps: true }
);

export default OutfitTag;
