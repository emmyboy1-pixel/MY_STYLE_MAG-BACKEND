import express from "express";
import {
  authenticateUser,
  checkAuthorizedPermissions,
} from "../middleware/authentication.js";
import {
  searchAllForAdmin,
  searchAllForUsers,
  searchBlogs,
  searchLookBook,
  searchOutfits,
  searchUsers,
} from "../controllers/search.controller.js";

const searchRouter = express.Router();

searchRouter.use(authenticateUser);

searchRouter.get("/users", searchAllForUsers);
searchRouter.get(
  "/admin",
  checkAuthorizedPermissions("admin"),
  searchAllForAdmin
);
searchRouter.get("/blog", searchBlogs);
searchRouter.get("/outfit", searchOutfits);
searchRouter.get("/lookBook", searchLookBook);
searchRouter.get("/user", checkAuthorizedPermissions("admin"), searchUsers);

export default searchRouter;
