import type { User } from "@/utils/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const AUTH_ENDPOINT_BASE = "localhost:5000/api/auth/";

export const authSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: AUTH_ENDPOINT_BASE,
        prepareHeaders(headers)
        {
            headers.set("Content-Type", "application/json");
            return headers;
        }
    }),
    endpoints(builder)
    {
        return {
            signUp: builder.mutation<User, User & { message: string; }>({
                query: (user) => ({
                    url: `signup`,
                    method: "POST",
                    body: user
                })
            }),
            login: builder.mutation<User, Pick<User, 'email' & 'password'>>({
                query: (user) => ({
                    url: `login`,
                    method: "POST",
                    body: user
                })
            }),
            logout: builder.query<{ message: string; }, void>({
                query: () =>
                {
                    return `/logout`;
                }
            }),
            verify: builder.query<User, number>({
                query: (id) =>
                {
                    return `verify/${id}`;
                }
            }),
        };
    }
});

interface AuthorizedState
{
    isAuthorized: boolean;
    user: User | undefined;
}

const initialState: AuthorizedState = {
    isAuthorized: false,
    user: undefined,
};

const isAuthorizedSlice = createSlice({
    name: "authorized",
    initialState,
    reducers: {
        setAuthState(state)
        {
            state.isAuthorized = true;
        },
        resetAuthState(state)
        {
            state.isAuthorized = false;
        },
        setUser(state, action: PayloadAction<User>)
        {
            state.user = action.payload;
        },
        resetUser(state)
        {
            state.user = undefined;
        }
    }
});

export const { useSignUpMutation, useLoginMutation, useLogoutQuery, useVerifyQuery } = authSlice;
export const { setAuthState, resetAuthState, setUser, resetUser } = isAuthorizedSlice.actions;
export default isAuthorizedSlice.reducer;