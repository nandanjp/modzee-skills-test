import HttpException from "@/utils/exceptions/http.exception";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export default function errorMiddleware(
    error: HttpException,
    _req: Request,
    res: Response,
    _next: NextFunction
): void
{
    const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || "Something went wrong internally";

    res.status(status).send({
        status,
        message
    });
}