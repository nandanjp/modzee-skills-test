import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { Response } from "express";

export const createToken = (user: User, res: Response, secret: "jwt" | "email" = "jwt"): string =>
{
    const token = jwt.sign({ id: user.id }, (secret == "jwt" ? process.env.JWT_SECRET : process.env.EMAIL_SECRET) as jwt.Secret, {
        expiresIn: '1d'
    });
    if (secret == "jwt")
    {
        res.cookie(secret, token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, //MS
            httpOnly: true,
            sameSite: "strict"
        });
    }

    return token;
};

export const verifyToken = (token: string, secret: "jwt" | "email" = "jwt") =>
{
    return jwt.verify(token, (secret == "jwt" ? process.env.JWT_SECRET : process.env.EMAIL_SECRET) as jwt.Secret) as { id: string, expiresIn: number; };
};