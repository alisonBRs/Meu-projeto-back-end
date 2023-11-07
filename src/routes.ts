import { Router } from "express";
import { routeType } from "./interface/route-type";
import { userController } from "./controllers/user-controllers";
import { login } from "./login-controller/login";
import { likes } from "./controllers/likes-controller";
import { authMiddleware } from "./middlewares/authMiddleware";

export class Route implements routeType {
  path = "";
  route = Router();

  constructor() {
    this.route.get("/", userController.getUser);
    this.route.get("/user/:id", userController.getOneUser);

    this.route.post("/register", login.register);
    this.route.post("/login", login.createLogin);
    this.route.get("/profile", authMiddleware, login.profile);
    this.route.delete("/user-delete/:id", login.deleteAccount);

    this.route.get("/post/:userId/:postId", userController.getOnePost);
    this.route.get("/posts", authMiddleware, userController.getAllPosts);
    this.route.post("/post/:id", userController.createPost);
    this.route.get(
      "/user-posts",
      authMiddleware,
      userController.getUniqueUserPosts
    );

    this.route.post("/like/:userId/:postId", likes.addLikes);
    this.route.post("/dislike/:userId/:postId", likes.removeLike);
  }
}
