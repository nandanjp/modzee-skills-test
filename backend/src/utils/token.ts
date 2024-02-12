import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { Response } from "express";

export const createToken = (user: User, res: Response): string =>
{
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as jwt.Secret, {
        expiresIn: '1d'
    });
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, //MS
        httpOnly: true,
        sameSite: "strict"
    });

    return token;
};

export const verifyToken = (token: string) =>
{
    return jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as { id: string, expiresIn: number; };
};