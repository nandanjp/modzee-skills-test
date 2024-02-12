import { z } from "zod";
import { zfd } from "zod-form-data";

export const GetUsersSchema = {
    query: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
    }),
    params: undefined,
    body: undefined
};

export const GetUserByIdSchema = {
    query: undefined,
    params: z.object({
        id: z.string()
    }),
    body: undefined
};

export const GetUserAlbumSchema = {
    query: undefined,
    params: z.object({
        id: z.string()
    }),
    body: undefined
};

export const GetPhotoFromUserAlbumSchema = {
    query: undefined,
    params: z.object({
        id: z.string(),
        photoId: z.string()
    }),
    body: undefined
};

export const CreateUserSchema = {
    query: undefined,
    params: undefined,
    body: zfd.formData({
        name: zfd.text().default(""),
        phone: zfd.text().default(""),
        email: zfd.text().default(""),
        password: zfd.text().default(""),
        confirmPassword: zfd.text().default(""),
        bio: zfd.text().default(""),
        profilePicture: zfd.file(),
    })
};

export const CreateUserAlbumSchema = {
    query: undefined,
    params: z.object({
        id: z.string()
    }),
    body: zfd.formData({
        title: z.string(),
        description: z.string(),
        picture: zfd.file(),
        featured: z.boolean().default(false)
    })
};

export const DeleteUserSchema = {
    query: undefined,
    params: z.object({
        id: z.string()
    }),
    body: undefined
};