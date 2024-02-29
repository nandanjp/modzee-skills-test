import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "@/utils/token";
import { TypeOf } from "zod";
import HttpException from "@/utils/exceptions/http.exception";
import { CreateUser, GetUserByEmail, GetUserById, GetUsers, VerifyUser } from "@/resources/user/user.service";
import { LoginUserSchema, SignUpUserSchema, VerifyUserSchema } from "@/resources/auth/auth.validate";
// import nodemailer from "nodemailer";

export const signupFormValidator = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        console.log(req.body);
        console.log(req.file);
        SignUpUserSchema.body.parse(req.body);
        next();
    } catch (error)
    {

        next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to correctly parse the form data: ${error}`));
    }
};

export const signupHandler = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const body = req.body as TypeOf<typeof SignUpUserSchema.body>;
        if (body.password != body.confirmPassword)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `passwords do not match`));
        }
        if (!req.file)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `did not pass in a profile picture`));
        }
        const users = await GetUserByEmail({ email: body.email });
        if (users)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `User with the email, ${body.email}, already exists`));
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(body.password, salt);
        const newUser = await CreateUser({
            bio: body.bio,
            confirmPassword: body.confirmPassword,
            password: hashed,
            email: body.email,
            name: body.name,
            phone: body.phone,
        }, req.file);

        if (!newUser)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `Invalid user provided`));
        }

        // const info = await nodemailer.createTransport({
        //     service: "gmail",
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS
        //     }
        // }).sendMail({
        //     to: newUser.email,
        //     subject: 'Confirm your email address',
        //     text: `Click the following link to confirm your email address: localhost:5000/api/auth/verify?id=${createToken(newUser, res, "email")}`
        // });

        // console.log('Email sent:', info);
        res.status(StatusCodes.CREATED).json({
            id: newUser.id,
            name: newUser.name,
            phone: newUser.phone,
            email: newUser.email,
            createdAt: newUser.createdAt,
            profilePicture: newUser.profilePicture,
            bio: newUser.bio,
            message: `Click the following link to verify your account: localhost:5000/api/auth/verify?id=${createToken(newUser, res, "email")}`
        });
    } catch (error)
    {
        next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to signup a user: ${error}`));
    }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const { email, password } = req.body as TypeOf<typeof LoginUserSchema.body>;
        const user = await GetUserByEmail({ email });

        if (!user)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `Invalid email or password provided`));
        }

        if (!user.verified)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `Please confirm your email to login`));
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!isPasswordCorrect)
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
            verified: user.verified,
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

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const { id } = req.query as TypeOf<typeof VerifyUserSchema.query>;
        if (!id)
        {
            return next(new HttpException(StatusCodes.UNAUTHORIZED, `User could not be verified.`));
        }
        const confirm = verifyToken(id, "email");
        if (!confirm.id)
        {
            return next(new HttpException(StatusCodes.UNAUTHORIZED, `Incorrect token provided: could not verify user with the token ${id}`));
        }

        const user = await VerifyUser(confirm);
        if (!user)
        {
            return next(new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, `Failed to verify the user`));
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
        next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to verify the user: ${error}`));
    }
};