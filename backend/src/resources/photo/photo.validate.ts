import { z } from "zod";
import { zfd } from "zod-form-data";

export const GetPhotosSchema = {
    params: undefined,
    query: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        featured: z.string().optional()
    }),
    body: undefined
};

export const GetPhotoIdSchema = {
    params: z.object({
        id: z.string()
    }),
    query: undefined,
    body: undefined,
};

export const CreatePhotoSchema = {
    params: undefined,
    query: undefined,
    body: zfd.formData({
        title: zfd.text(),
        description: zfd.text(),
        featured: zfd.checkbox(),
        forUser: zfd.text(),
    })
};

export const UpdatePhotoSchema = {
    params: z.object({
        id: z.string()
    }),
    query: undefined,
    body: zfd.formData({
        title: zfd.text().optional(),
        description: zfd.text().optional(),
        featured: zfd.checkbox({ trueValue: "true" })
    })
};

export const DeletePhotoSchema = {
    params: z.object({
        id: z.string()
    }),
    query: undefined,
    body: undefined
};