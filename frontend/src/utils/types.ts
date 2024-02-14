export interface User
{
    id: number;
    name: string;
    phone: string;
    email: string;
    password: string;
    bio: string;
    profilePicture: string,
    createdAt: Date;
    updatedAt: Date;
    verified: boolean;
    album: Photo[];
}

export interface Photo
{
    id: number;
    title: string;
    description: string;
    img: string;
    date: Date;
    featured: boolean;
    userId: number;
    user: User;
}