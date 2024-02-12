import { z } from "zod";

export const CreateUserSchema = z.object({
    name: z.string().default(""),
    phone: z.string().default(""),
    email: z.string().default(""),
    password: z.string().default(""),
    confirmPassword: z.string().default(""),
    bio: z.string().default(""),
    profilePicture: z.string(),
});

export const CreateUserAlbumSchema = z.object({
    title: z.string(),
    description: z.string(),
    picture: z.any(),
    featured: z.boolean().default(false)
});

export const DeleteUserSchema = {
    query: undefined,
    params: z.object({
        id: z.string()
    }),
    body: undefined
};