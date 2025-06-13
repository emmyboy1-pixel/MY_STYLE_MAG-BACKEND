import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Category = sequelize.define(
  "Category",
  {
    // id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM("outfit", "blog"), dafaultValue: "outfit" },
    // slug: { type: DataTypes.STRING, },  // still to come back to this line
  },
  { tableName: 'categories'},
  { timestamps: true }
);


Category.associate = function(models){
  Category.hasMany(models.Outfit, {
    foreignKey: 'categoryId'
  });
};

export default Category;
