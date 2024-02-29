import type { Photo } from "@/utils/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const Photos_Endpoint_Base = "localhost:5000/api/photos/";

export const photosSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: Photos_Endpoint_Base,
        prepareHeaders(headers)
        {
            headers.set("Content-Type", "application/json");
            return headers;
        }
    }),
    endpoints(builder)
    {
        return {
            getPhotos: builder.query<Photo[], void>({
                query: () =>
                {
                    return ``;
                }
            }),
            getPhotoById: builder.query<Photo, number>({
                query: (id) =>
                {
                    return `${id}`;
                }
            }),
            createPhoto: builder.mutation<{ status: number, message: string; }, Photo>({
                query: (user) => ({
                    url: ``,
                    method: "POST",
                    body: user
                })
            }),
        };
    }
});

export const { useGetPhotosQuery, useGetPhotoByIdQuery, useCreatePhotoMutation } = photosSlice;