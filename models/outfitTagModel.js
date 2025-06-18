// // outfitTagModel.js
// import { DataTypes } from "sequelize";
// import { sequelize } from "../config/dbConfig.js";

// const outfitTag = sequelize.define(
//   "outfitTag",
//   {
//     outfitId: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: "Outfits",
//         key: "id",
//       },
//     },
//     tagId: {
//       type: DataTypes.INTEGER,
//       references: {
//         model: "Tags",
//         key: "id",
//       },
//     },
//   },
//   { timestamps: true }
// );

// export default outfitTag;
