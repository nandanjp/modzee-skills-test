import { Request, Response, NextFunction } from "express";
import { AddPhotoToUserAlbum, CreateUser, GetUserAlbum, GetUserById, GetUsers } from "@/resources/user/user.service";
import { StatusCodes } from "http-status-codes";
import HttpException from "@/utils/exceptions/http.exception";
import { TypeOf } from "zod";
import { CreateUserAlbumSchema, CreateUserSchema, DeleteUserSchema, GetUserAlbumSchema, GetUserByIdSchema } from "./user.validate";
import { getImage, saveImage } from "@/utils/imageHelpers";
import { CreatePhotoSchema } from "../photo/photo.validate";

export const getUsers = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const users = await GetUsers(req.query) ?? [];
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            users
        });
        return users;
    } catch (error)
    {
        next(new HttpException(StatusCodes.BAD_REQUEST, `${error}`));
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const params = req.params as TypeOf<typeof GetUserByIdSchema.params>;
        const user = await GetUserById(params);
        if (!user)
        {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: `User with the given id, ${params.id}, could not be found`
            });
        }
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            user
        });
    } catch (error)
    {
        next(new HttpException(StatusCodes.BAD_REQUEST, `Could not retrieve a user with the given id: ${error}`));
    }
};

export const getUserAlbum = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const params = req.params as TypeOf<typeof GetUserAlbumSchema.params>;
        const user = await GetUserById(params);
        if (!user)
        {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: `User with given id, ${params.id}, could not be found`
            });
        }
        const album = await GetUserAlbum(params);
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: album
        });
    } catch (error)
    {
        next(new HttpException(StatusCodes.BAD_REQUEST, `Could not retrieve the album of the given user`));
    }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        if (!req.file || !req.file.buffer)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to save the user's profile image: ${req.file}`));
        }

        const newUser = await CreateUser(req.body as TypeOf<typeof CreateUserSchema.body>, req.file);
        if (!newUser)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to create a new user for an unknown reason`));
        }
        const fileCreated = await saveImage(req.file?.buffer, req.file?.mimetype, req.file?.originalname);
        if (!fileCreated)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to save the user's profile image: ${req.file}`));
        }

        res.status(StatusCodes.CREATED).json({
            status: StatusCodes.CREATED,
            message: `successfully created a user and uploaded their profle picture to S3`
        });
    } catch (error)
    {
        next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to create a new user: ${error}`));
    }
};

export const addPictureToUserAlbum = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const params = req.params as TypeOf<typeof CreateUserAlbumSchema.params>;
        const body = req.body as TypeOf<typeof CreateUserAlbumSchema.body>;

        if (!req.file)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                message: `Failed to add a photo to the user's album since there was no file provided`
            });
        }
        const fileExists = await getImage(req.file?.filename);
        if (!fileExists)
        {
            const createdImage = await saveImage(req.file.buffer, req.file.mimetype, req.file.originalname);
            if (!createdImage)
            {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    status: StatusCodes.BAD_REQUEST,
                    message: `Failed to save the photo and thus add it to the user's album: ${req.file}`
                });
            }
        }

        const newPhoto = await AddPhotoToUserAlbum(params, body, req.file);
        if (!newPhoto)
        {
            return res.status(StatusCodes.BAD_REQUEST).json({
                status: StatusCodes.BAD_REQUEST,
                message: `Failed to create and add a photo to the user's album: userId = ${params.id}, newPhoto = ${newPhoto}`
            });
        }
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: `Successfully added the image to `
        });

    } catch (error)
    {
        next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to add a picture to the current user's album: ${error}`));
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const params = req.params as TypeOf<typeof DeleteUserSchema.params>;
        const user = prisma?.user.delete({
            where: {
                id: parseInt(params.id)
            }
        });
        if (!user)
        {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: StatusCodes.NOT_FOUND,
                message: `User with given id, ${params.id}, could not be found. Failed to delete this user`
            });
        }
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: `User with the id, ${params.id}, was succesfully deleted`
        });
    } catch (error)
    {
        next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to delete the current user: ${error}`));
    }
};

export const createUserFormValidator = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        CreateUserSchema.body.parse(req.body);
        next();
    } catch (error)
    {
        res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, error: "failed to parse form data correctly" });

        next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to correctly parse the form data: ${error}`));
    }
};

export const createAlbumFormValidator = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        CreatePhotoSchema.body.parse(req.body);
        next();
    } catch (error)
    {

        next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to correctly parse the form data: ${error}`));
    }
};