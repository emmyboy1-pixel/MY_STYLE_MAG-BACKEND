import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const BlogPost = sequelize.define(
  "BlogPost",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.INTEGER, allowNull: false },
    content: { type: DataTypes.STRING, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
  },
  { timestamps: true }
);

export default BlogPost;
