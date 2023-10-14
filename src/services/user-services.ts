import { prisma } from "../interface/default-prisma/prisma";
import { userType } from "../interface/user-type";

type postServiceType = {
  title: string;
  description: string;
};

class UserServices {
  async getUser() {
    const response = await prisma.user.findMany({
      include: { posts: true, post_likes: true },
    });
    return response;
  }

  async getUserById(id: string) {
    const response = await prisma.user.findUnique({
      where: { id },
      include: { post_likes: true, _count: { select: { posts: true } } },
    });

    return response;
  }

  async createUser({ email, password, name }: userType) {
    const response = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },

      include: { posts: true, post_likes: true },
    });

    return response;
  }

  async deleteUser(id: string) {
    const response = await prisma.user.delete({ where: { id } });

    return response;
  }

  async createPost(id: string, req: postServiceType) {
    await prisma.post.create({
      data: {
        title: req.title,
        description: req.description,

        user: {
          connect: {
            id,
          },
        },
      },
    });
  }

  async getAllPosts(loggedUser: string) {
    const postsLiked = await prisma.likes.findMany({
      where: { userId: loggedUser },
    });

    await prisma.post.updateMany({
      data: {
        loggedUserLiked: !!postsLiked,
      },
    });

    const response = await prisma.post.findMany({
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return response;
  }

  async getSinglePost(userId: string, postId: string) {
    return await prisma.post.findFirst({
      where: {
        id: postId,
        likes: {
          every: {
            userId,
          },
        },
      },
    });
  }
}

export const userService = new UserServices();
