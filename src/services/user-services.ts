import { prisma } from "../interface/default-prisma/prisma";
import { userType } from "../interface/user-type";
import type { Post } from "@prisma/client";
interface ResponsePosts extends Post {
  userLikedPost?: boolean;
}
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

  async getAllPosts(loggedUserId: string) {
    const response: ResponsePosts[] = await prisma.post.findMany({
      include: {
        user: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    for (const post of response) {
      const index = response.findIndex((item: any) => item.id === post.id);
      const userLikedPost = await prisma.likes.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: loggedUserId,
          },
        },
      });
      response[index].userLikedPost = !!userLikedPost;
    }

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

  async getUniqueUserPosts(id: string) {
    return await prisma.post.findMany({
      where: { userId: id },
      include: { user: true },
    });
  }
}

export const userService = new UserServices();
