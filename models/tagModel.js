import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Tag = sequelize.define(
  "Tag",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.TEXT, allowNull: false },
    // slug: { type: DataTypes.STRING, },  // still to come back to this line
  },
  { timestamps: true }
);

export default Tag;
