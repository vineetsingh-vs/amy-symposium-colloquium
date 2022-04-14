import { Request, Response, NextFunction } from "express";
import config from "../utils/config";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Path Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({
        message: err.message,
        stack: config.nodeEnv === "production" ? null : err.stack,
    });
};