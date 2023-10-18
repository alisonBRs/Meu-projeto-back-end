import { Request, Response } from "express";
import { likesService } from "../services/likes-service";
import { prisma } from "../interface/default-prisma/prisma";

function validateFields({ verifyUserId, verifyPostId, userId, postId }: any) {
  if (!verifyUserId) {
    return { error: "user id not founded" };
  }

  if (!verifyPostId) {
    return { error: "post id not founded" };
  }

  if (!userId) {
    //falsy 0 null undefined "" false
    return { error: "user id is missing" };
  }

  if (!postId) {
    return { error: "post id is missing" };
  }
}

class Likes {
  async addLikes(req: Request, res: Response) {
    const userId = req.params.userId;
    const postId = req.params.postId;

    const verifyUserId = await prisma.user.findUnique({
      where: { id: userId },
    });
    const verifyPostId = await prisma.post.findUnique({
      where: { id: postId },
    });

    const isValid = validateFields({
      verifyPostId,
      verifyUserId,
      userId,
      postId,
    });

    if (isValid?.error) {
      return res.status(400).json(isValid);
    }

    if (!postId) {
      return res.status(401).json({ error: "post id is missing" });
    }

    const alreadyExists = await prisma.likes.findUnique({
      where: {
        postId_userId: {
          userId,
          postId,
        },
      },
    });

    if (alreadyExists?.userId || alreadyExists?.postId) {
      return res.status(401).json({ error: "post already liked" });
    }

    await likesService.addLike(userId, postId);

    const like = { userId, postId };

    return res.json({ success: like });
  }

  async removeLike(req: Request, res: Response) {
    const userId = req.params.userId;
    const postId = req.params.postId;

    const verifyUserId = await prisma.user.findUnique({
      where: { id: userId },
    });
    const verifyPostId = await prisma.post.findUnique({
      where: { id: postId },
    });

    const isValid = validateFields({
      verifyPostId,
      verifyUserId,
      userId,
      postId,
    });

    if (isValid?.error) {
      return res.status(400).json(isValid);
    }

    const alreadyExists = await prisma.likes.findUnique({
      where: {
        postId_userId: {
          userId,
          postId,
        },
      },
    });

    if (!alreadyExists?.userId || !alreadyExists?.postId) {
      return res.status(401).json({ error: "post not founded" });
    }

    await likesService.removeLike(userId, postId);

    const like = { userId, postId };

    return res.json({ success: like });
  }
}

export const likes = new Likes();
