import express from 'express'
import { LoginSchema, SignupSchema } from '../types.js'
import { UserModel } from '../models.js'
const app = express()


app.post("./auth/signup", async (req, res) => {
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

app.post("./auth/login", async (req, res) => {
    const { data, success } = LoginSchema.safeParse(req.body)
    if (!success) {
        res.status(400).json({
            "success": false,
            "error": "Invalid response",
        })

        const userDb = await UserModel.findOne({
            email: data.Email
        })

        if (!userDb || userDb.password != data.password) {
            res.status(400).json({
                "success": false,
                "error": "Invalid email or password"
            })
            return
        }

    }
})

app.get("./auth/me", (req, res) => { })

app.post("./class", (req, res) => { })

app.post("./class/:id/add-student", (req, res) => { })

app.get("./class/:id", (req, res) => { })

app.get("./students", (req, res) => { })

app.get("./class/:id/my-attendance", (req, res) => { })

app.post("./attendance/start", (req, res) => { })


app.listen(3000) 