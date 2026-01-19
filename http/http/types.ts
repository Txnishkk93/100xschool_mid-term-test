import z, { string } from 'zod'

export const SignupSchema=z.object({
    name:z.string(),
    email:z.email(),
    password:z.string().min(6),
    role:z.enum(["teacher","student"])
})

export const LoginSchema=z.object({
    email:z.email(),
    password:z.string().min(6)
})

export const MeSchema=z.object({
    className:z.string()
})

export const AddStudentSchema=z.object({
    studentId:z.string()
})

export const StartSchema=z.object({
    classId:z.string()
})
