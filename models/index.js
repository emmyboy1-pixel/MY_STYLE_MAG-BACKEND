//  ### WE are defining our different relationships in this file

import { sequelize } from "../config/dbConfig.js";
import User from "./userModels.js";
import Lookbook from "./lookbookModels.js";
import Outfit from "./outfitModel.js";
import BlogPost from "./blogPostModel.js";
import Admin from "./adminModel.js";
import Category from "./categoryModel.js";
import outfitTag from "./outfitTagModel.js";

// User relationships here
User.hasMany(Lookbook, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "lookbooks",
});
User.hasMany(Outfit, { foreignKey: "userId", as: "outfits" });

// Lookbook relationships here
Lookbook.belongsTo(User, { foreignKey: "userId", as: "user" });
Lookbook.hasMany(Outfit, {
  foreignKey: "lookbookId",
  as: "outfits",
  onDelete: "CASCADE",
});

// Outfit relationships here
Outfit.belongsTo(User, { foreignKey: "userId" });
Outfit.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
// Outfit.belongsToMany(Tag, { through: outfitTag, foreignKey: 'outfitId', as: 'tags'});

// Outfit.belongsToMany(Category, )

// BlogPost relationship here

// categories relationship here
Category.hasMany(Outfit, { foreignKey: "categoryId", as: "outfits" });

// Tag relationships here

//  Admin Relationships here

export { sequelize, User, Lookbook, Outfit };
