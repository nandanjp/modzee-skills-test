import { number, z } from "zod";
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
        bio: zfd.text().default(""),
        profilePicture: zfd.file(),
    })
};

export const CreateUserAlbumSchema = {
    query: undefined,
    params: z.object({
        id: number()
    }),
    body: zfd.formData({
        picture: zfd.file().array(),
    })
};

export const UpdateUserSchema = {
    query: undefined,
    params: z.object({
        id: z.number()
    }),
    body: zfd.formData({
        name: zfd.text().optional(),
        phone: zfd.text().optional(),
        email: zfd.text().optional(),
        bio: zfd.text().optional(),
        profilePicture: zfd.file().optional(),
    })
};

export const DeleteUserSchema = {
    query: undefined,
    params: z.object({
        id: z.number()
    }),
    body: undefined
};