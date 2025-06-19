import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Lookbook = sequelize.define(
  "Lookbook",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
  },
  { timestamps: true }
);

export default Lookbook;
