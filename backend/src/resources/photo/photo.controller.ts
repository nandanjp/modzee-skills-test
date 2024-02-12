import IController from "@/utils/interfaces/controller.interface";
import { Photo } from "@prisma/client";
import { NextFunction, Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import multer from "multer";
import { CreatePhotoSchema, DeletePhotoSchema, GetPhotoIdSchemas, GetPhotosSchema, UpdatePhotoSchema } from "@/resources/photo/photo.validate";
import validationMiddleware from "@/middleware/validation.middleware";

class PhotoController implements IController
{
    public extendPath: string;
    public router: Router;
    private profileUpload = multer();

    constructor()
    {
        this.extendPath = "/photos";
        this.router = Router();

        this.profileUpload = multer({
            storage: multer.memoryStorage()
        });

        this.initializeRouters();
    }

    private initializeRouters(): void
    {
        this.router.get(`${this.extendPath}/`, validationMiddleware(GetPhotosSchema), this.getPhotos);
        this.router.get(`${this.extendPath}/:id`, validationMiddleware(GetPhotoIdSchemas), this.getPhotoById);
        this.router.post(`${this.extendPath}/`, this.createPhotoFormValidator, this.profileUpload.single('profile'), this.createPhoto);
        this.router.put(`${this.extendPath}/:id`, this.updatePhotoFormValidator, this.profileUpload.single('profile'), this.updatePhoto);
        this.router.delete(`${this.extendPath}/:id`, validationMiddleware(DeletePhotoSchema), this.deletePhoto);
    }

    private createPhotoFormValidator = async (req: Request, res: Response, next: NextFunction): Promise<Photo | void> =>
    {
        try
        {
            CreatePhotoSchema.body.parse(req.body);
        } catch (error)
        {
            res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, error: "failed to parse form data correctly" });
        }
    };

    private updatePhotoFormValidator = async (req: Request, res: Response, next: NextFunction): Promise<Photo | void> =>
    {
        try
        {
            UpdatePhotoSchema.params.parse(req.params);
            UpdatePhotoSchema.body.parse(req.body);
        } catch (error)
        {
            res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, error: "failed to update the photo" });
        }
    };

    private getPhotos = async (req: Request, res: Response, next: NextFunction): Promise<Photo[] | void> =>
    {

    };

    private getPhotoById = async (req: Request, res: Response, next: NextFunction): Promise<Photo | void> =>
    {

    };


    private createPhoto = async (req: Request, res: Response, next: NextFunction): Promise<Photo | void> =>
    {

    };

    private updatePhoto = async (req: Request, res: Response, next: NextFunction): Promise<Photo | void> =>
    {

    };

    private deletePhoto = async (req: Request, res: Response, next: NextFunction): Promise<Photo | void> =>
    {

    };
}

export default PhotoController;