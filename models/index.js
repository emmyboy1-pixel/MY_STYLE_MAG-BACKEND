// //  ### WE are defining our different relationships in this file

// import BlogPost from "./blogPost.model.js";

// import User from "./userModels.js";
// import Category from "./categoryModel.js";
// import Outfit from "./outfit.model.js";

// // import Lookbook from "./lookbookModels.js";
// // import Tag from "./tagModel.js";
// // import outfitTag from "./outfitTagModel.js";

// // Blog relationships
// BlogPost.belongsTo(User, {
//   foreignKey: "createdBy",
//   as: "publisher",
// });
// BlogPost.belongsTo(User, {
//   foreignKey: "updatedBy",
//   as: "updater",
// });
// BlogPost.belongsTo(Category, {
//   foreignKey: "categoryId",
//   as: "category",
// });

// // User relationships
// User.hasMany(BlogPost, {
//   foreignKey: "createdBy",
//   as: "createdPosts",
// });
// User.hasMany(BlogPost, {
//   foreignKey: "updatedBy",
//   as: "updatedPOsts",
//   onDelete: "SET NULL",
// });
// User.hasMany(Outfit, {
//   foreignKey: "creator_userId",
//   as: "outfits_by_user",
// });

// User.hasMany(Outfit, {
//   foreignKey: "updater_userId",
//   as: "outfits_updater",
//   onDelete: "SET NULL",
// });

// //Category relationships
// Category.hasMany(BlogPost, {
//   foreignKey: "categoryId",
//   as: "blogPosts",
//   onDelete: "SET NULL",
// });

// Category.hasMany(Outfit, {
//   foreignKey: "categoryId",
//   as: "category_outfits",
//   onDelete: "SET NULL",
// });

// // // Outfit relationships here
// Outfit.belongsTo(User, { foreignKey: "userId", as: "creator" });
// Outfit.belongsTo(Category, {
//   foreignKey: "categoryId",
//   as: "outfit_category",
// });

// // User.hasMany(Lookbook, {
// //   foreignKey: "userId",
// //   onDelete: "CASCADE",
// //   as: "lookbooks",
// // });

// // User.hasMany(Outfit, { foreignKey: "userId", as: "outfits" });

// // // Lookbook relationships here
// // Lookbook.belongsTo(User, { foreignKey: "userId", as: "user" });
// // Lookbook.hasMany(Outfit, {
// //   foreignKey: "lookbookId",
// //   as: "outfits",
// //   onDelete: "CASCADE",
// // });

// // // Outfit.belongsToMany(Category, )
// // // Define many-to-many relationships
// // Outfit.belongsToMany(Tag, { through: outfitTag, foreignKey: "outfitId" });
// // Tag.belongsToMany(Outfit, { through: outfitTag, foreignKey: "tagId" });

// // // categories relationship here
// // Category.hasMany(Outfit, { foreignKey: "categoryId", as: "outfits" });

// // // Tag relationships here

// // //  Admin Relationships here

// export { User, BlogPost, Outfit };

// models/index.js

import User from "./user.model.js";
import Lookbook from "./lookbook.model.js";
import Outfit from "./outfit.model.js";
import Category from "./category.model.js";
import Tag from "./tag.model.js";
import BlogPost from "./blogPost.model.js";
import OutfitTag from "./outfitTag.model.js";
import BlogPostTag from "./blogPostTag.model.js";
import LookbookOutfit from "./lookBookOutfit.model.js";

// ========================
// USER RELATIONSHIPS
// ========================

// CreatedBy, UpdatedBy Relationships
Outfit.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
  onDelete: "SET NULL",
});
Outfit.belongsTo(User, {
  foreignKey: "updatedBy",
  as: "updater",
  onDelete: "SET NULL",
});
User.hasMany(Outfit, { foreignKey: "createdBy", as: "createdOutfits" });
User.hasMany(Outfit, { foreignKey: "updatedBy", as: "updatedOutfits" });

BlogPost.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
  onDelete: "SET NULL",
});
BlogPost.belongsTo(User, {
  foreignKey: "updatedBy",
  as: "updater",
  onDelete: "SET NULL",
});
User.hasMany(BlogPost, {
  foreignKey: "createdBy",
  as: "createdBlogPosts",
});
User.hasMany(BlogPost, { foreignKey: "updatedBy", as: "updatedBlogPosts" });

Category.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
  onDelete: "SET NULL",
});
Category.belongsTo(User, {
  foreignKey: "updatedBy",
  as: "updater",
  onDelete: "SET NULL",
});
User.hasMany(Category, { foreignKey: "createdBy", as: "createdCategories" });
User.hasMany(Category, { foreignKey: "updatedBy", as: "updatedCategories" });

Tag.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
  onDelete: "SET NULL",
});
Tag.belongsTo(User, {
  foreignKey: "updatedBy",
  as: "updater",
  onDelete: "SET NULL",
});
User.hasMany(Tag, { foreignKey: "createdBy", as: "createdTags" });
User.hasMany(Tag, { foreignKey: "updatedBy", as: "updatedTags" });

// ========================
// USER TO LOOKBOOK TO OUTFIT
// ========================

User.hasMany(Lookbook, {
  foreignKey: "userId",
  as: "lookbooks",
});
Lookbook.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
  onDelete: "CASCADE",
});

Lookbook.belongsToMany(Outfit, {
  through: LookbookOutfit,
  foreignKey: "lookbookId",
  otherKey: "outfitId",
  as: "outfits",
});

Outfit.belongsToMany(Lookbook, {
  through: LookbookOutfit,
  foreignKey: "outfitId",
  otherKey: "lookbookId",
  as: "lookbooks",
});

// ========================
// OUTFIT TO TAG (Many-to-Many)
// ========================

Outfit.belongsToMany(Tag, {
  through: OutfitTag,
  foreignKey: "outfitId",
  otherKey: "tagId",
  as: "tags",
});
Tag.belongsToMany(Outfit, {
  through: OutfitTag,
  foreignKey: "tagId",
  otherKey: "outfitId",
  as: "outfits",
});

// ========================
// BLOGPOST TO TAG (Many-to-Many)
// ========================

BlogPost.belongsToMany(Tag, {
  through: BlogPostTag,
  foreignKey: "blogPostId",
  otherKey: "tagId",
  as: "tags",
});
Tag.belongsToMany(BlogPost, {
  through: BlogPostTag,
  foreignKey: "tagId",
  otherKey: "blogPostId",
  as: "blogPosts",
});

// ========================
// OUTFIT TO CATEGORY (One-to-Many)
// ========================

Outfit.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
  onDelete: "SET NULL",
});
Category.hasMany(Outfit, { foreignKey: "categoryId", as: "outfits" });

// ========================
// BLOGPOST TO CATEGORY (One-to-Many)
// ========================

BlogPost.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(BlogPost, { foreignKey: "categoryId", as: "blogPosts" });

export {
  User,
  Lookbook,
  Outfit,
  Category,
  Tag,
  BlogPost,
  OutfitTag,
  BlogPostTag,
};
