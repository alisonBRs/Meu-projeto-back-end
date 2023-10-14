import { prisma } from "../interface/default-prisma/prisma";

class LikeService {
  async addLike(userId: string, postId: string) {
    const alreadyExists = await prisma.likes.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
    if (alreadyExists) {
      return;
    }
    await prisma.likes.create({
      data: {
        postId,
        userId,
      },
    });
  }

  async removeLike(userId: string, postId: string) {
    await prisma.likes.delete({
      where: {
        postId_userId: {
          userId,
          postId,
        },
      },
    });
  }
}

export const likesService = new LikeService();
