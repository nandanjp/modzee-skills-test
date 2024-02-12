import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import IToken from "@/utils/interfaces/token.interface";

export const createToken = (user: User): string =>
{
    return jwt.sign({ id: user.id }, process.env.JWT_SECRET as jwt.Secret, {
        expiresIn: 'id'
    });
};

export const verifyToken = async (token: string): Promise<jwt.VerifyErrors | IToken> =>
{
    return new Promise((resolve, reject) =>
    {
        jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payload) =>
        {
            if (err) reject(err);
            resolve(payload as IToken);
        });
    });
};