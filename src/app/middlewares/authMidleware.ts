import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export default (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new Error("No token, authorization denied");
  }

  try {
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
