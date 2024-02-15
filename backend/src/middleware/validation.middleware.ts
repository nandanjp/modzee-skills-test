import HttpException from "@/utils/exceptions/http.exception";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError, ZodObject } from "zod";

const validationMiddleware = (schemas: { params: ZodObject<any, any> | undefined, body: ZodObject<any, any> | undefined, query: ZodObject<any, any> | undefined; }) =>
{
    return async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            if (schemas.params)
            {
                schemas.params.parse(req.params);
            }
            if (schemas.body)
            {
                schemas.body.parse(req.body);
            }
            if (schemas.query)
            {
                schemas.query.parse(req.query);
            }
            next();
        } catch (error)
        {
            if (error instanceof ZodError)
            {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: StatusCodes.BAD_REQUEST,
                    errors: error.errors.map(e =>
                    {
                        message: `${e.path.join('.')} is ${e.message}`;
                    })
                });
            } else
            {
                next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, "Unknown error from validation"));
            }
        }
    };
};

export default validationMiddleware;