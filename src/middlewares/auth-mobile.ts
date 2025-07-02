import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";

config();
export const authWithJwtMobile = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).send({ message: "Forbidden" });

    (req as any).user = user;
    next();
  });
};
