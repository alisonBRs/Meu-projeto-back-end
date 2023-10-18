import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { tokenType } from "../interface/token-type";

export interface customRequest extends Request {
  userId: string;
}

export async function authMiddleware(
  err: any,
  req: Request,
  res: Response,

  next: NextFunction
) {
  console.log("err", err);
  try {
    const { authorization } = req.headers;

    const token = authorization?.split(" ")[1];

    const user = jwt.verify(
      token as string,
      process.env.SECRET_KEY as string
    ) as tokenType;

    if (!user.id) {
      return res.status(401).json({ error: "user not authorized" });
    }

    (req as customRequest).userId = user.id;

    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "token has expired" });
  }
}
