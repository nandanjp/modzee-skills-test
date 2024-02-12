import { z } from "zod";
import { CreateUserAlbumSchema, CreateUserSchema, GetUserAlbumSchema, GetUserByIdSchema, GetUsersSchema } from "@/resources/user/user.validate";
import { Photo, User } from "@prisma/client";
import prisma from "@/utils/db";

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

export async function CreateUser(user: z.infer<typeof CreateUserSchema.body>)
{
    try
    {
        if (!user.bio || !user.email || !user.password || !user.name || !user.phone || !user.profilePicture)
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
                profilePicture: user.profilePicture.name,
                album: {
                    create: {
                        description: "profile picture",
                        img: user.profilePicture.name,
                        title: "profile picture",
                        featured: false,
                    }
                }
            },
            // select: {
            //     id: true,
            //     name: true,
            //     email: true,
            //     phone: true,
            //     profilePicture: true,
            //     createdAt: true,
            //     bio: true,
            // }
        });
        if (!newUser)
        {
            throw new Error("failed to create a new user");
        }
        return newUser;
    } catch (error)
    {
        throw new Error(`failed to create a new user, ${user}: ${error}`);
    }
}

export async function AddPhotoToUserAlbum(userId: z.infer<typeof CreateUserAlbumSchema.params>, picture: z.infer<typeof CreateUserAlbumSchema.body>)
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
                img: picture.picture.name,
                ...picture
            }
        });

        if (!newPhoto)
        {
            throw new Error(`Failed to create a new photo`);
        }

        return newPhoto;
    } catch (error)
    {
        throw new Error(`Failed to create a new photo and add it to the user's album: ${error}`);
    }
}