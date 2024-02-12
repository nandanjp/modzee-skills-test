export interface User
{
    id: number;
    name: string;
    phone: string;
    email: string;
    password: string;
    bio: string;
    profilePicture: string;
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

const base = `localhost:5000` as const;

const AuthEndpoints = [`${base}/api/auth/login`, `${base}/api/auth/signup`, `${base}/api/auth/logout`, `${base}/api/auth/verify`, `${base}/api/user/`] as const;
const UserEndpoints = [`${base}/api/users/`, `${base}/api/users/{id}`, `${base}/api/users/{id}`, `${base}/api/users/{id}/album`, `${base}/users/{id}/album`] as const;
const PhotoEndpoints = [`${base}/api/photos/`, `${base}/api/photos/{id}`, `${base}/api/photos/`, `${base}/api/photos/{id}`] as const;

export type AuthEndpointTypes = typeof AuthEndpoints[number];
export type UserEndpointsTypes = typeof UserEndpoints[number];
export type PhotoEndpointsTypes = typeof PhotoEndpoints[number];