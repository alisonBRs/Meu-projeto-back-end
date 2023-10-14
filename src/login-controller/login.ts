import { Request, Response } from "express";
import { userType } from "../interface/user-type";
import { userService } from "../services/user-services";
import { prisma } from "../interface/default-prisma/prisma";
import { tokenType } from "../interface/token-type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userController } from "../controllers/user-controllers";

class Login {
  async register(req: Request, res: Response) {
    const { name, email, password }: userType = req.body;

    const encryptedPass = await bcrypt.hash(password, 10);

    const verifyEmail = await prisma.user.findUnique({ where: { email } });

    if (verifyEmail) {
      return res.status(401).json({ error: "Email already exist" });
    }

    const user = await userService.createUser({
      name,
      email,
      password: encryptedPass,
    });

    const { password: _, ...userData } = user;

    return res.json(userData);
  }

  async createLogin(req: Request, res: Response) {
    const { email, password }: userType = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "User not authorized" });
    }

    const verifyPass = await bcrypt.compare(password, user?.password as string);

    if (!verifyPass) {
      return res.status(401).json({ error: "User not authorized" });
    }

    const token = jwt.sign({ id: user?.id }, process.env.SECRET_KEY as string, {
      expiresIn: "1h",
    });

    const { password: _, ...userData } = user;

    return res
      .cookie("token", token, {
        httpOnly: false,
        secure: true,
        domain: "localhost",
        path: "/",
        sameSite: true,
      })
      .json({ userData, token });
  }

  async profile(req: Request, res: Response) {
    const { authorization } = req.headers;

    const token = authorization?.split(" ")[1] as string;

    try {
      const verifyJwt = jwt.verify(
        token,
        process.env.SECRET_KEY as string
      ) as tokenType;

      await userController.getAllPosts(req, res, verifyJwt.id);

      const user = await prisma.user.findUnique({
        where: { id: verifyJwt.id },
      });

      if (!user) {
        return res.status(401).json({ error: "User not authorized" });
      }

      const { password: _, ...authenticadedUser } = user;

      return res.json({ authenticadedUser, token });
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: "Token has expired" });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const id = req.params.id;

      const user = await userService.deleteUser(id);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      return res
        .status(200)
        .json({ success: `Account with name: ${user?.name} deleted` });
    } catch (error) {
      return res.status(401).json({ error: "User not found" });
    }
  }
}

export const login = new Login();
