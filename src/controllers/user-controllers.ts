import { Request, Response } from "express";
import { userService } from "../services/user-services";
import { prisma } from "../interface/default-prisma/prisma";
import { customRequest } from "../middlewares/authMiddleware";

class UserControllers {
  async getUser(req: Request, res: Response) {
    const user = await userService.getUser();

    return res.json(user);
  }

  async getOneUser(req: Request, res: Response) {
    const id = req.params.id;

    if (!id) {
      return res.status(401).json({ error: "user not founded" });
    }

    const verifyId = await prisma.user.findUnique({ where: { id } });

    if (!verifyId) {
      return res.status(401).json({ error: "user not founded" });
    }

    try {
      const response = await userService.getUserById(id);

      return res.json(response);
    } catch (error) {
      return res.status(401).json({ error: "user not founded" });
    }
  }

  async getOnePost(req: Request, res: Response) {
    const userId = req.params.userId;
    const postId = req.params.postId;

    const verifyUser = await prisma.user.findUnique({ where: { id: userId } });
    const verifyPost = await prisma.post.findUnique({ where: { id: postId } });

    if (!verifyUser) {
      return res.status(401).json({ error: "user id not founded" });
    }
    if (!verifyPost) {
      return res.status(401).json({ error: "post id not founded" });
    }

    try {
      const response = await userService.getSinglePost(userId, postId);

      return res.json(response);
    } catch (err) {
      console.error(err);
    }
  }

  async getAllPosts(req: Request, res: Response) {
    const userId = (req as customRequest).userId;

    const response = await userService.getAllPosts(userId as string);
    const havePosts = response.filter((post) => post.title && post.description);
    return res.json(havePosts);
  }

  async createPost(req: Request, res: Response) {
    const id = req.params.id;
    const { title, description } = req.body;

    const verifyId = await prisma.user.findUnique({ where: { id } });

    if (!verifyId?.id) {
      return res.status(401).json({ error: "user id not founded" });
    }

    if (!title && !description) {
      return res
        .status(401)
        .json({ error: "title and description is missing" });
    }

    if (!title) {
      return res.status(401).json({ error: "title is missing" });
    }

    if (!description) {
      return res.status(401).json({ error: " description is missing" });
    }

    await userService.createPost(id, { title, description });

    const postData = { title, description };

    return res.json(postData);
  }
}

export const userController = new UserControllers();
