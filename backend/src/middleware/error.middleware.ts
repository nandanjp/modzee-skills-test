import HttpException from "@/utils/exceptions/http.exception";
import { NextFunction, Request, Response } from "express";

export default function errorMiddleware(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void
{
    const status = error.status || 500;
    const message = error.message || "Something went wrong internally";

    res.status(status).send({
        status,
        message
    });
}