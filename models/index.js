import User from "./user.model.js";
import Lookbook from "./lookbook.model.js";
import Outfit from "./outfit.model.js";
import Category from "./category.model.js";
import Tag from "./tag.model.js";
import BlogPost from "./blogPost.model.js";
import OutfitTag from "./outfitTag.model.js";
import BlogPostTag from "./blogPostTag.model.js";
import LookbookOutfit from "./lookbookOutfit.model.js";

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

export { User, Lookbook, Outfit, Category, Tag, BlogPost };
