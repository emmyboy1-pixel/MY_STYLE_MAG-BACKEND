import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const BlogPostTag = sequelize.define(
  "BlogPostTag",
  {
    blogPostId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "BlogPosts",
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

export default BlogPostTag;
