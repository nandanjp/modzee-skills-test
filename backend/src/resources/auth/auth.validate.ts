import { z } from "zod";
import { zfd } from "zod-form-data";

export const SignUpUserSchema = {
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

export const LoginUserSchema = {
    body: zfd.formData({
        email: zfd.text().default(""),
        password: zfd.text().default("")
    })
};

export const VerifyUserSchema = {
    query: z.object({ token: z.string() })
};