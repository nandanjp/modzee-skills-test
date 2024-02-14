import { NextFunction, Request, Response } from "express";
import { CreatePhotoSchema, DeletePhotoSchema, GetPhotoIdSchema } from "@/resources/photo/photo.validate";
import { StatusCodes } from "http-status-codes";
import HttpException from "@/utils/exceptions/http.exception";
import { CreatePhoto, DeletePhoto, GetAllPhotos, GetPhotoById } from "@/resources/photo/photo.service";
import { TypeOf } from "zod";

export const createPhotoFormValidator = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        CreatePhotoSchema.body.parse(req.body);
        next();
    } catch (error)
    {
        next(new HttpException(StatusCodes.BAD_REQUEST, `failed to validate the create photo schema: ${error}`));
    }
};

export const getPhotos = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const photos = await GetAllPhotos();
        if (!photos)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to get all photos from the database`));
        }
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: photos
        });
        return photos;
    } catch (error)
    {
        next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to get all photos from the database: ${error}`));
    }
};

export const getPhotoById = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const params = req.params as TypeOf<typeof GetPhotoIdSchema.params>;
        const photo = await GetPhotoById(params);
        if (!photo)
        {
            return next(new HttpException(StatusCodes.NOT_FOUND, `Failed to get a photo with the given id, ${params.id}`));
        }
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: photo
        });
        return photo;
    } catch (error)
    {
        next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to get a photo with the given id: ${error}`));
    }
};

export const createPhoto = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const body = req.body as TypeOf<typeof CreatePhotoSchema.body>;
        if (!req.file)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to create a photo: did not pass in a picture file`));
        }
        const photo = await CreatePhoto(body, req.file);
        if (!photo)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to create a photo with the given information: ${body}`));
        }
        res.status(StatusCodes.CREATED).json({
            status: StatusCodes.CREATED,
            message: photo
        });
    } catch (error)
    {
        next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to create a photo with the given information: ${error}`));
    }
};

export const deletePhoto = async (req: Request, res: Response, next: NextFunction) =>
{
    try
    {
        const params = req.params as TypeOf<typeof DeletePhotoSchema.params>;
        const photo = await DeletePhoto(params);
        if (!photo)
        {
            return next(new HttpException(StatusCodes.BAD_REQUEST, `Failed to delete a photo with the given information: ${params}`));
        }
        res.status(StatusCodes.OK).json({
            status: StatusCodes.OK,
            message: photo
        });
    } catch (error)
    {

    }
};