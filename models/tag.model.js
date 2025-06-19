import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Tag = sequelize.define(
  "Tag",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: true }
);

export default Tag;
