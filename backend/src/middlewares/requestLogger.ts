import { Request, Response, NextFunction } from "express";
import logger from "../helpers/logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.get("User-Agent") || "";
  
  logger.info(`${method} ${url} - ${userAgent}`);
  
  next();
};
