import { verificarToken } from "../utils/jwt";
import type {
    Response, Request, NextFunction
} from "express";
import { db } from '../prisma/db';

export async function auth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "missing token"
        })
    }
    try {
        const token = header.slice("Bearer ".length)
        const payload = verificarToken(token)
        if (!payload) return res.status(401).json({
            error: "invalid token"
        })
        const tokenBanco = await db.orm.public.Token.where({token}).first()
        if(tokenBanco?.revoked) return res.status(401).json({
            error: "revoked token"
        })
        next();
    } catch {
            return res.status(401).json({
                error: "invalid or expired token"
        })
    }
}