import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const BlogPost = sequelize.define(
  "BlogPost",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM("Draft", "Archived", "Pending", "Published"),
      defaultValue: "Draft",
      allowNull: false,
    },
    views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Categories", key: "id" },
      onDelete: "SET NULL",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "Users", key: "id" },
      onDelete: "SET NULL",
    },
  },
  { timestamps: true }
);

export default BlogPost;
