import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { createToken } from "@/utils/token";
import { TypeOf } from "zod";
import HttpException from "@/utils/exceptions/http.exception";
import { CreateUser, GetUserByEmail, GetUsers } from "@/resources/user/user.service";
import { LoginUserSchema, SignUpUserSchema } from "@/resources/auth/auth.validate";

export const signupHandler = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const body = req.body as TypeOf<typeof SignUpUserSchema.body>;
        if (body.password != body.confirmPassword)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `passwords do not match`));
        }
        const users = await GetUsers({ email: body.email });
        if (users)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `User with the email, ${body.email}, already exists`));
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(body.password, salt);

        const newUser = await CreateUser({
            bio: body.bio,
            confirmPassword: body.confirmPassword,
            password: body.password,
            email: body.email,
            name: body.name,
            phone: body.phone,
            profilePicture: body.profilePicture
        });

        if (newUser)
        {
            await createToken(newUser, res);

            res.status(StatusCodes.CREATED).json({
                id: newUser.id,
                name: newUser.name,
                phone: newUser.phone,
                email: newUser.email,
                createdAt: newUser.createdAt,
                profilePicture: newUser.profilePicture,
                bio: newUser.bio,
            });
        } else
        {
            next(new HttpException(StatusCodes.BAD_REQUEST, `Invalid user provided`));
        }

    } catch (error)
    {
        next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to create a user`));
    }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const { email, password } = req.body as TypeOf<typeof LoginUserSchema.body>;
        const user = await GetUserByEmail({ email });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `Invalid email or password provided`));
        }

        createToken(user, res);
        res.status(StatusCodes.OK).json({
            id: user.id,
            name: user.name,
            phone: user.phone,
            email: user.email,
            createdAt: user.createdAt,
            profilePicture: user.profilePicture,
            bio: user.bio,
        });
    } catch (error)
    {
        next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to login a user`));
    }
};

export const logoutHandler = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
    } catch (error)
    {
        next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to logout a user`));
    }
};
