import { env } from "../config/env.config";
import jwt from 'jsonwebtoken'

export type Role = "freelancer" | "client" | "admin"

export function generateAccessToken(userId: string, role: Role) {
    return jwt.sign({id: userId, role}, env.JWT_SECRET, {expiresIn: '20s'});
}

export function generateRefreshToken(userId: string, role: Role) {
    return jwt.sign({id: userId, role}, env.REFRESH_SECRET, {expiresIn: '7d'})
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, env.JWT_SECRET) as {id: string, role: Role}
    } catch (error) {
        return null
    }
}

export function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, env.REFRESH_SECRET) as {id: string, role: Role}
    } catch (error) {
        return null
    }
}