import prisma from "@/utils/db";
import { TypeOf } from "zod";
import { CreatePhotoSchema, DeletePhotoSchema, GetPhotoIdSchema } from "./photo.validate";
import { saveImage } from "@/utils/imageHelpers";

export const GetAllPhotos = async () =>
{
    try
    {
        const photos = await prisma.photo.findMany({
        });
        return photos;
    } catch (error)
    {
        throw new Error(`Failed to get all photos: ${error}`);
    }
};

export const GetPhotoById = async ({ id }: TypeOf<typeof GetPhotoIdSchema.params>) =>
{
    try
    {
        const photo = await prisma.photo.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!photo)
        {
            throw new Error(`Failed to get a photo with the id, ${id}`);
        }
        return photo;
    } catch (error)
    {
        throw new Error(`Failed to get a photo at all with the id, ${id}`);
    }
};

export const CreatePhoto = async ({ title, description, featured, forUser }: TypeOf<typeof CreatePhotoSchema.body>, img: Express.Multer.File) =>
{
    try
    {
        const newPhoto = await prisma.photo.create({
            data: {
                userId: parseInt(forUser),
                title,
                description,
                img: img.originalname,
                featured
            }
        });
        if (!newPhoto)
        {
            throw new Error(`Failed to create a photo with the given parameters: ${title}, ${description}, ${forUser}`);
        }

        const response = saveImage(img.buffer, img.mimetype, img.originalname);
        if (!response)
        {
            throw new Error(`Failed to save the image to the cloud: ${response}`);
        }

        return newPhoto;
    } catch (error)
    {
        throw new Error(`Failed to create a photo with the given parameters: ${title}, ${description}, ${forUser}: ${error}`);
    }
};

export const DeletePhoto = async ({ id }: TypeOf<typeof DeletePhotoSchema.params>) =>
{
    try
    {
        const deletedPhoto = await prisma.photo.delete({
            where: {
                id: parseInt(id)
            }
        });
        if (!deletedPhoto)
        {
            throw new Error(`Failed to delete a photo with the given id: ${id}`);
        }
        return deletedPhoto;
    } catch (error)
    {
        throw new Error(`Failed to delete a photo with the given id: ${id}, ${error}`);
    }
};