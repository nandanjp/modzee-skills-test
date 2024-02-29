import type { User } from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const Users_Endpoint_Base = "localhost:5000/api/users/";

export const userSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: Users_Endpoint_Base,
        prepareHeaders(headers)
        {
            headers.set("Content-Type", "application/json");
            return headers;
        }
    }),
    endpoints(builder)
    {
        return {
            getUsers: builder.query<User[], void>({
                query: () =>
                {
                    return ``;
                }
            }),
            getUserById: builder.query<User, number>({
                query: (id) =>
                {
                    return `${id}`;
                }
            }),
            getUserAlbum: builder.query<User, number>({
                query: (id) =>
                {
                    return `${id}/album`;
                }
            }),
            createUser: builder.mutation<{ status: number, message: string; }, User>({
                query: (user) => ({
                    url: ``,
                    method: "POST",
                    body: user
                })
            }),
        };
    }
});

export const { useGetUsersQuery, useGetUserByIdQuery, useGetUserAlbumQuery, useCreateUserMutation } = userSlice;