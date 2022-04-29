import { Request, Response, NextFunction } from "express";
import config from "../utils/config";
import { verify } from "jsonwebtoken";

export const jwt = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = verify(token, config.tokenSecret!) as any;
            req.userId = decoded.id;
            next();
        } catch (err) {
            console.error("[jwt] Failed to Authorize Token", err);
            res.status(401).json({
                message: "Failed to Authorize Token",
                error: err
            });
            return;
        }
    } else {
        res.status(401).json({
            message: "Not Authorized"
        });
    }
}