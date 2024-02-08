import HttpException from "@/utils/exceptions/http.exception";
import { NextFunction, Request, Response } from "express";
import { ZodAny } from "zod";

export default async (schema: ZodAny) =>
{
    return async (req: Request, res: Response, next: NextFunction) =>
    {
        const result = schema.safeParse(req.body);
        if (!result.success)
        {
            next(new HttpException(400, result.error.issues.map(e => e.message).join(",")));
        }
    };
};