import express from 'express'
import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
        res.status(401).json({
            "success": false,
            "error": "Unauthorized, token missing or invalid"
        })
        return
    }
    try {
        const { userId, role } = jwt.verify(token, process.env.JWT_TOKEN!)
        req.userId = userId,
            req.role = role
        next()
    } catch (err) {
        res.status(401).json({
            "success": false,
            "error": "Unauthorized, token missing or invalid"
        })
    }
}

export const teacheRoleMiddleware = (req: Request, res: Response, next: NextFunction){
    if (!req.role || req.role == "teacher") {
        res.status(403).json({

            "success": false,
            "error": "Forbidden, teacher access required"
        })
        return
    }
    next()
}

export const StudentRoleMiddleware = (req: Request, res: Response, next: NextFunction){
    if (!req.role || req.role == "student") {
        res.status(403).json({

            "success": false,
            "error": "Forbidden, not class teacher"
        })
        return
    }
    next()
}