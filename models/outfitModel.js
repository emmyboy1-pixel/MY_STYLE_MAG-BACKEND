import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

const Outfit = sequelize.define(
  "Outfit",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    // slug: { type: DataTypes.STRING, },  // still to come back to this line
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "id",
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },

  { 
    tableName: 'outfits',
    timestamps: true 
  }
);

Outfit.associate = function(models){
  Outfit.belongsTo(models.User, { foreignKey: 'userId'});
  Outfit.belongsTo(models.Category, { foreignKey: 'categoryId'});
  Outfit.belongsTo(models.Admin, { foreignKey: "createdBy" });
  Outfit.belongsToMany(models.Tag, {
    through: 'OutfitTags',
    foreignKey: 'outfitId'
  });
};

export default Outfit;
