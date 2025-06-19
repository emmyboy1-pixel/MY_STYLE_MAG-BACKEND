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
    userId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: true }
);

export default Lookbook;
