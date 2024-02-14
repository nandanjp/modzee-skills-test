import { GetUserById } from "@/resources/user/user.service";
import { verifyToken } from "@/utils/token";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const authenticate = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const token = req.headers.cookie?.split("jwt=")[1];
        if (!token)
        {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusCodes.UNAUTHORIZED,
                message: "A user must be logged to fulfill this request"
            });
        }
        const decoded = verifyToken(token);
        if (!decoded)
        {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusCodes.UNAUTHORIZED,
                message: "A user must be logged to fulfill this request"
            });
        }
        const user = await GetUserById({ id: decoded.id });
        if (!user)
        {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: "The authenticated user was not found and may no longer exist..."
            });
        }
        if (!user.verified)
        {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: StatusCodes.UNAUTHORIZED,
                message: "The user's email has not been verified yet....."
            });
        }

        req.user = user;
        next();
    } catch (error)
    {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            message: `Failed to check if user is logged in with error: ${error}`
        });
    }
};