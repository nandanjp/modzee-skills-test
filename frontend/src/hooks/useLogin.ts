import { authStore } from "@/zustand/store";
import { useState } from "react";
import axios from "axios";
import { AuthEndpointTypes } from "@/utils/types";

export const useLogin = () =>
{
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = authStore();

    const login = async () =>
    {
        const login: AuthEndpointTypes = "localhost:5000/api/auth/login";

        setLoading(true);
        try
        {
            const res: { id: string; } = await axios.request({
                method: "POST",
                url: login,
                headers: {
                    'Content-Type': "application/json"
                }
            });
        } catch (error)
        {

        }
    };
};