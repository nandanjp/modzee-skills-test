import validationMiddleware from "@/middleware/validation.middleware";
import IController from "@/utils/interfaces/controller.interface";
import { Photo, User } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import multer from "multer";
import { CreateUserAlbumSchema, CreateUserSchema, DeleteUserSchema, GetPhotoFromUserAlbumSchema, GetUserAlbumSchema, GetUserByIdSchema, GetUsersSchema } from "./user.validate";
import { StatusCodes } from "http-status-codes";
import { CreatePhotoSchema } from "../photo/photo.validate";
import HttpException from "@/utils/exceptions/http.exception";
import { CreateUser, GetUserById, GetUsers } from "@/resources/user/user.service";
import { TypeOf, z } from "zod";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "crypto";

class UserController implements IController
{
    public extendPath: string;
    public router: Router;
    private albumUploader = multer();

    constructor()
    {
        this.extendPath = "/users";
        this.router = Router();

        this.albumUploader = multer({
            storage: multer.memoryStorage()
        });
        this.initializeRouter();
    }

    private initializeRouter()
    {
        this.router.get(`${this.extendPath}`, validationMiddleware(GetUsersSchema), this.getUsers);
        this.router.get(`${this.extendPath}/:id`, validationMiddleware(GetUserByIdSchema), this.getUserById);
        this.router.get(`${this.extendPath}/:id/album`, validationMiddleware(GetUserAlbumSchema), this.getUserAlbums);
        this.router.get(`${this.extendPath}/:id/album/:photoId`, validationMiddleware(GetPhotoFromUserAlbumSchema), this.getImageFromUserAlbum);
        this.router.post(`${this.extendPath}/`, this.createUserFormValidator, this.albumUploader.single('profile'), this.createUser);
        this.router.post(`${this.extendPath}/:id`, this.createAlbumFormValidator, this.albumUploader.array('album', 5), this.createAlbum);
        this.router.put(`${this.extendPath}/:id`, this.albumUploader.single('profile'), this.updateUser);
        this.router.delete(`${this.extendPath}/:id`, validationMiddleware(DeleteUserSchema), this.deleteUser);
    }

    private getUsers = async (req: Request, res: Response, next: NextFunction): Promise<User[] | void> =>
    {
        try
        {
            const users = await GetUsers(req.query);
            res.status(StatusCodes.OK).json({
                status: 200,
                users
            });
            return users;
        } catch (error)
        {
            next(new HttpException(StatusCodes.BAD_REQUEST, `${error}`));
        }
    };

    private getUserById = async (req: Request, res: Response, next: NextFunction): Promise<User | void> =>
    {
        try
        {
            const user = await GetUserById(req.params as z.infer<typeof GetUserByIdSchema.params>);
            if (!user)
            {
                res.status(StatusCodes.BAD_REQUEST).json({
                    status: 400,
                    user: null
                });
                return;
            }
            res.status(StatusCodes.OK).json({
                status: 200,
                user
            });
            return user;
        } catch (error)
        {
            next(new HttpException(StatusCodes.BAD_REQUEST, `${error}`));
        }
    };

    private getUserAlbums = async (req: Request, res: Response, next: NextFunction): Promise<Photo[] | void> =>
    {
        try
        {

        } catch (error)
        {
            next(new HttpException(StatusCodes.BAD_REQUEST, `${error}`));
        }
    };

    private getImageFromUserAlbum = async (req: Request, res: Response, next: NextFunction): Promise<Photo | void> =>
    {
        try
        {

        } catch (error)
        {
            next(new HttpException(StatusCodes.BAD_REQUEST, `${error}`));
        }
    };

    private createUser = async (req: Request, res: Response, next: NextFunction): Promise<User | void> =>
    {
        try
        {
            console.log(req.file);
            console.log(req.body);
            const newUser = await CreateUser(req.body);
            const s3 = new S3Client({
                credentials: {
                    accessKeyId: process.env.ACCESS_KEY as string,
                    secretAccessKey: process.env.SECRET_ACCESS_KEY as string
                },
                region: process.env.BUCKET_REGION as string
            });
            await s3.send(new PutObjectCommand({
                Bucket: process.env.BUCKET_REGION as string,
                Key: `${req.file?.originalname}-${crypto.randomBytes(32).toString('hex')}`,
                Body: req.file?.buffer,
                ContentType: req.file?.mimetype,
            }));
            res.send(StatusCodes.OK).json({
                status: StatusCodes.OK,
                user: newUser
            });
        } catch (error)
        {
            next(new HttpException(StatusCodes.BAD_REQUEST, `${error}`));
        }
    };

    private createUserFormValidator = async (req: Request, res: Response, next: NextFunction): Promise<Photo | void> =>
    {
        try
        {
            CreateUserSchema.body.parse(req.body);
        } catch (error)
        {
            res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, error: "failed to parse form data correctly" });
        }
    };

    private createAlbum = async (req: Request, res: Response, next: NextFunction): Promise<Photo[] | void> =>
    {
        CreateUserAlbumSchema.params.parse(req.params);
        CreateUserAlbumSchema.body.parse(req.body);
    };

    private createAlbumFormValidator = async (req: Request, res: Response, next: NextFunction): Promise<Photo | void> =>
    {
        try
        {
            CreatePhotoSchema.body.parse(req.body);
        } catch (error)
        {
            res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, error: "failed to parse form data correctly" });
        }
    };

    private updateUser = async (req: Request, res: Response, next: NextFunction): Promise<User | void> =>
    {
        try
        {

        } catch (error)
        {
            next(new HttpException(StatusCodes.BAD_REQUEST, `${error}`));
        }
    };

    private deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<User | void> =>
    {
        try
        {

        } catch (error)
        {
            next(new HttpException(StatusCodes.BAD_REQUEST, `${error}`));
        }
    };
}