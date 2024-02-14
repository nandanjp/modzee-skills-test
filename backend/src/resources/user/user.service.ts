import { z } from "zod";
import { CreateUserAlbumSchema, CreateUserSchema, GetUserAlbumSchema, GetUserByIdSchema, GetUsersSchema } from "@/resources/user/user.validate";
import { Photo, User } from "@prisma/client";
import prisma from "@/utils/db";
import { saveImage } from "@/utils/imageHelpers";

export async function GetUsers(queries: z.infer<typeof GetUsersSchema.query>): Promise<User[] | void>
{
    try
    {
        return await prisma.user.findMany({
            where: {
                name: queries.name,
                phone: queries.phone,
                email: queries.email
            }
        });
    } catch (error)
    {
        throw new Error(`failed to get users with the given query parameters, ${queries}: ${error}`);
    }
}

export async function GetUserById({ id }: z.infer<typeof GetUserByIdSchema.params>): Promise<User | null>
{
    try
    {
        return await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });
    } catch (error)
    {
        throw new Error(`failed to get a user with the given id, ${id}: ${error}`);
    }
}

export async function GetUserByEmail({ email }: { email: string; })
{
    try
    {
        return await prisma.user.findUnique({
            where: {
                email
            }
        });
    } catch (error)
    {
        throw new Error(`failed to get a user with the given email, ${email}: ${error}`);
    }
}

export async function GetUserAlbum({ id }: z.infer<typeof GetUserAlbumSchema.params>): Promise<Photo[] | null>
{
    try
    {
        return await prisma.photo.findMany({
            where: {
                userId: parseInt(id)
            }
        });
    } catch (error)
    {
        throw new Error(`failed to get the given user's album, the user whose id is ${id}: ${error}`);
    }
}

export async function CreateUser(user: z.infer<typeof CreateUserSchema.body>, profile: Express.Multer.File)
{
    try
    {
        if (!user.bio || !user.email || !user.password || !user.name || !user.phone || !profile)
        {
            throw new Error("cannot have empty fields for properties that the user requires!");
        }

        const newUser = await prisma.user.create({
            data: {
                bio: user.bio,
                email: user.email,
                password: user.password,
                name: user.name,
                phone: user.phone,
                profilePicture: profile.originalname,
                album: {
                    create: {
                        description: "profile picture",
                        img: profile.originalname,
                        title: "profile picture",
                        featured: false,
                    }
                }
            },
        });
        if (!newUser)
        {
            throw new Error("failed to create a new user");
        }
        const response = saveImage(profile.buffer, profile.mimetype, profile.originalname);
        if (!response)
        {
            throw new Error(`Failed to save the image to the cloud: ${response}`);
        }
        return newUser;
    } catch (error)
    {
        throw new Error(`failed to create a new user, ${user}: ${error}`);
    }
}

export async function AddPhotoToUserAlbum(userId: z.infer<typeof CreateUserAlbumSchema.params>, picture: z.infer<typeof CreateUserAlbumSchema.body>, photo: Express.Multer.File)
{
    try
    {
        const user = await GetUserById(userId);
        if (!user)
        {
            throw new Error(`Failed to retrieve a user with the id: ${userId}`);
        }

        const newPhoto = await prisma.photo.create({
            data: {
                userId: parseInt(userId.id),
                img: photo.originalname
                ,
                ...picture
            }
        });

        if (!newPhoto)
        {
            throw new Error(`Failed to create a new photo`);
        }

        const response = saveImage(photo.buffer, photo.mimetype, photo.originalname);
        if (!response)
        {
            throw new Error(`Failed to save the image to the cloud: ${response}`);
        }

        return newPhoto;
    } catch (error)
    {
        throw new Error(`Failed to create a new photo and add it to the user's album: ${error}`);
    }
}

export async function VerifyUser(userId: z.infer<typeof GetUserByIdSchema.params>)
{
    try
    {
        const user = await GetUserById(userId);
        if (!user)
        {
            throw new Error(`Failed to retrieve a user with the id: ${userId}`);
        }
        const verifiedUser = await prisma.user.update({
            data: {
                ...user,
                verified: true
            },
            where: {
                id: user.id,
                email: user.email
            }
        });

        if (!verifiedUser)
        {
            throw new Error(`Failed to verify/update the user's verification status: ${verifiedUser}`);
        }
        return verifiedUser;
    } catch (error)
    {

    }
}