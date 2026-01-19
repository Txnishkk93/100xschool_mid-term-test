import express from 'express'
import { ClassSchema, LoginSchema, SignupSchema } from '../types.js'
import { ClassModel, UserModel } from '../models.js'
import jwt from "jsonwebtoken"
import { authMiddleware, StudentRoleMiddleware, teacheRoleMiddleware } from '../middleware.js'
const app = express()


app.use(express.json())
app.post("/auth/signup", async (req, res) => {
    const { success, data } = SignupSchema.safeParse(req.body)
    if (!success) {
        res.status(400).json({
            "success": false,
            "error": "Error message",
        })
        return
    }
    const user = await UserModel.findOne({
        email: data.email
    })
    if (user) {
        res.status(400).json({
            "success": false,
            "error": "Email already exists"
        })
        return
    }

    const userDb = await UserModel.create({
        name: data.name,
        email: data.email,
        password: data.password
    })
    res.status(201).json({
        success: true,
        data: {
            _id: userDb._id,
            name: userDb.name,
            email: userDb.email,
            password: userDb.password,
        }
    })
})

app.post("/auth/login", async (req, res) => {
    const { success, data } = LoginSchema.safeParse(req.body)
    if (!success) {
        res.status(400).json({
            "success": false,
            "error": "Invalid request schema",
        })
        return
    }
    const userDb = await UserModel.findOne({
        email: data.email

    })
    if (!userDb || userDb.password != data.password) {
        res.status(400).json({
            "success": false,
            "error": "Invalid email or password"
        })
        return
    }

    const token = jwt.sign({
        role: userDb.role,
        userId: userDb._id,
    }, process.env.JWT_TOKEN!)
    res.status(200).json({
        "success": true,
        "data": {
            token
        }
    })
})

app.get("/auth/me", authMiddleware, async (req, res) => {
    const user = await UserModel.findOne({
        _id: req.userId
    })
    if (!user) {
        res.status(403).json({
            message: "bhang bhosda"
        })
        return
    }
    res.json({
        "success": true,
        "data": {
            "_id": user._id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    })
})

app.post("/class", teacheRoleMiddleware, async (req, res) => {
    const { success, data } = ClassSchema.safeParse(req.body)
    if (!success) {
        res.status(400).json({
            "success": false,
            "error": "Invalid request schema",
        })
        return
    }
    const classDB = await ClassModel.create({
        className: data.className,
        teacherId: req.userId,
        studentIds: []
    })
    res.status(201).json({
        "success": true,
        "data": {
            _id: classDB._id,
            className: classDB.className,
            teacherId: classDB.teacherId,
            studentIds: []
        }
    })
})

app.post("/class/:id/add-student", StudentRoleMiddleware, async (req, res) => {
    const { success, data } = ClassSchema.safeParse(req.body)
    if (!success) {
        res.status(400).json({
             "success": false,
            "error": "Invalid request schema",
        })
        return
    }
    const studentDB = await ClassModel.create({
        className: data.className,
        teacherId: req.userId,
        studentIds: []
    })
    res.status(200).json({
        "success": true,
        "data": {
            _id: studentDB._id,
            className: studentDB.className,
            teacherId: studentDB.teacherId,
            studentIds: []
        }
    })
})

app.get("/class/:id", (req, res) => { })

app.get("/students", (req, res) => { })

app.get("/class/:id/my-attendance", (req, res) => { })

app.post("/attendance/start", (req, res) => { })


app.listen(3000) 