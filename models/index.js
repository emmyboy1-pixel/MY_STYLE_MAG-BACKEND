//  ### WE are defining our different relationships in this file

import BlogPost from "./blogPost.model.js";

import User from "./userModels.js";
import Category from "./categoryModel.js";

// import Lookbook from "./lookbookModels.js";
// import Outfit from "./outfitModel.js";
// import Tag from "./tagModel.js";
// import outfitTag from "./outfitTagModel.js";

// Blog relationships
BlogPost.belongsTo(User, {
  foreignKey: "createdBy",
  as: "publisher",
});
BlogPost.belongsTo(User, {
  foreignKey: "updatedBy",
  as: "updater",
});
BlogPost.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

// User relationships
User.hasMany(BlogPost, {
  foreignKey: "createdBy",
  as: "createdPosts",
});
User.hasMany(BlogPost, {
  foreignKey: "updatedBy",
  as: "updatedPOsts",
  onDelete: "SET NULL",
});

//Category relationships
Category.hasMany(BlogPost, {
  foreignKey: "categoryId",
  as: "blogPosts",
  onDelete: "SET NULL",
});

// User.hasMany(Lookbook, {
//   foreignKey: "userId",
//   onDelete: "CASCADE",
//   as: "lookbooks",
// });

// User.hasMany(Outfit, { foreignKey: "userId", as: "outfits" });

// // Lookbook relationships here
// Lookbook.belongsTo(User, { foreignKey: "userId", as: "user" });
// Lookbook.hasMany(Outfit, {
//   foreignKey: "lookbookId",
//   as: "outfits",
//   onDelete: "CASCADE",
// });

// // Outfit relationships here
// Outfit.belongsTo(User, { foreignKey: "userId" });
// Outfit.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
// // Outfit.belongsToMany(Tag, { through: outfitTag, foreignKey: 'outfitId', as: 'tags'});

// // Outfit.belongsToMany(Category, )
// // Define many-to-many relationships
// Outfit.belongsToMany(Tag, { through: outfitTag, foreignKey: "outfitId" });
// Tag.belongsToMany(Outfit, { through: outfitTag, foreignKey: "tagId" });

// // categories relationship here
// Category.hasMany(Outfit, { foreignKey: "categoryId", as: "outfits" });

// // Tag relationships here

// //  Admin Relationships here

export { User, BlogPost };
