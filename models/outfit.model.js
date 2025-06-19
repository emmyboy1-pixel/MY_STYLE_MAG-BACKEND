import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Outfit = sequelize.define(
  "Outfit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    imageUrls: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("imageUrls");
        try {
          return rawValue ? JSON.parse(rawValue) : [];
        } catch (err) {
          return [];
        }
      },
      set(value) {
        this.setDataValue("imageUrls", JSON.stringify(value || []));
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Categories",
        key: "id",
      },
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  { timestamps: true }
);

export default Outfit;
