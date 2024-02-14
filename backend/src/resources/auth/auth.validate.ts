import { z } from "zod";
import { zfd } from "zod-form-data";

export const SignUpUserSchema = {
    query: undefined,
    params: undefined,
    body: zfd.formData({
        name: zfd.text(),
        phone: zfd.text(),
        email: zfd.text(),
        password: zfd.text(),
        confirmPassword: zfd.text().default(""),
        bio: zfd.text().default(""),
    })
};

export const LoginUserSchema = {
    query: undefined,
    params: undefined,
    body: z.object({
        email: z.string().default(""),
        password: z.string().default("")
    })
};

export const VerifyUserSchema = {
    query: z.object({ id: z.string() }),
    params: undefined,
    body: undefined,
};