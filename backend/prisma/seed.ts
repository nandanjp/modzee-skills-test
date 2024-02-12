import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

interface Image
{
    id: number,
    title: string,
    description: string,
    img: string,
    date: string,
    featured: boolean;
}

interface Sampledata
{
    name: string,
    phone: string,
    email: string,
    bio: string,
    profile_picture: string,
    album: Image[];
};
async function main()
{
    try
    {
        const samples = fs.readFileSync("./sample.json", "utf-8");
        const userData = JSON.parse(samples) as Sampledata;

        const createUser = await prisma.user.create({
            data: {
                bio: userData.bio,
                email: userData.email,
                password: "kujoforall",
                name: userData.name,
                phone: userData.phone,
                profilePicture: userData.profile_picture,
            }
        });
        console.log(`Created user: ${createUser}`);

        const createPhotes = await Promise.all(userData.album.map(image =>
        {
            prisma.photo.create({
                data: {
                    ...image,
                    img: image.img,
                    userId: createUser.id
                }
            });
        }));

        console.log(`Created images: ${createPhotes}`);
    } catch (error)
    {
        console.error(`failed to read in the sample data, could not create the sample data`);
    }

}

main().then(
    async () =>
    {
        await prisma.$disconnect();
    }
).catch(async (e) =>
{
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})

