import { number, z } from "zod";
import { CreateUserSchema, GetUserAlbumSchema, GetUserByIdSchema, GetUsersSchema } from "@/resources/user/user.validate";
import { Photo, User } from "@prisma/client";
import prisma from "../../db";
import { error } from "console";

export async function GetUsers(queries: z.infer<typeof GetUsersSchema.query>): Promise<User[] | void>
{
    try
    {
        return await prisma.user.findMany({
            // select: {
            // id: true,
            // name: true,
            // phone: true,
            // createdAt: true,
            // loggedIn: true,
            // bio: true,
            // email: true,
            // },
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
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                profilePicture: true,
                createdAt: true,
                loggedIn: true,
            }
        });
        if (!newUser)
        {
            throw new Error("failed to create a new user");
        }
        return user;
    } catch (error)
    {
        throw new Error(`failed to create a new user, ${user}: ${error}`);
    }
}