import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // You can attach user info to `req` if needed
  // req.user = decodedUser;

  next(); // Continue to controller
};
