import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const LookbookOutfit = sequelize.define(
  "LookbookOutfit",
  {
    lookbookId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "LookBooks",
        key: "id",
      },
    },
    outfitId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Outfits",
        key: "id",
      },
    },
  },
  { timestamps: true }
);

export default LookbookOutfit;
