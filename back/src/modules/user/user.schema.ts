import { z } from 'zod';

export const createUserSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    username: z.string(),
    email: z.string(),
    password: z.string(),
})

export type CreateUserIput = z.infer<typeof createUserSchema>

export const createUserResponseSchema = z.object({
    id: z.string(),
    email: z.string(),
    username: z.string()
})

export const loginSchema = z.object({
    // email: z.string({
    //     required_error: 'Email is required',
    //     invalid_type_error: 'Email must be a string',
    // }).email(),
    email: z.string(),
    password: z.string(),
})

export type LoginUserInput = z.infer<typeof loginSchema>

export const loginResponseSchema = z.object({
    accessToken: z.string(),
})