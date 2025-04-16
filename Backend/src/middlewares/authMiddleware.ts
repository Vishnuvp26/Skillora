import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.config";
import { createHttpError } from "../utils/httpError";
import { HttpStatus } from "../constants/statusContstants";
import { Messages } from "../constants/messageConstants";
import User from "../models/user/userModel";

interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return next(createHttpError(HttpStatus.UNAUTHORIZED, Messages.TOKEN_REQUIRED));
    }

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };

        const user = await User.findById(decoded.id);
        if (!user) {
            return next(createHttpError(HttpStatus.UNAUTHORIZED, Messages.USER_NOT_FOUND));
        }
        if (user.status === "blocked") {
            return next(createHttpError(HttpStatus.FORBIDDEN, Messages.USER_BLOCKED));
        }

        req.user = decoded;
        next();
    } catch (error) {
        return next(createHttpError(HttpStatus.UNAUTHORIZED, Messages.INVALID_TOKEN));
    }
}

export function authorizeRoles(...allowedRoles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(createHttpError(HttpStatus.FORBIDDEN, Messages.NO_ACCESS));
        }
        next();
    };
}